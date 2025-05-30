from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunRealtimeReportRequest, Dimension, Metric
from google.oauth2 import service_account

import os

app = Flask(__name__, static_folder='static')
CORS(app)

credentials_path = os.getenv("GA_CREDENTIALS_PATH")
if not credentials_path:
    raise RuntimeError("GA_CREDENTIALS_PATH environment variable not set")

credentials = service_account.Credentials.from_service_account_file(credentials_path)
client = BetaAnalyticsDataClient(credentials=credentials)

GA4_PROPERTY_ID = "393664216"

@app.route('/active_users')
def get_realtime_users():
    try:
        request = RunRealtimeReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            dimensions=[Dimension(name="city")],
            metrics=[Metric(name="activeUsers")]
        )
        response = client.run_realtime_report(request)

        active_user_cities = [
            row.dimension_values[0].value
            for row in response.rows
            if row.dimension_values[0].value.lower() not in ["(not set)", "unknown"]
        ]

        return jsonify({"active_user_names": active_user_cities})

    except Exception as e:
        print("Error in get_realtime_users:", str(e))
        return jsonify({"error": "Failed to fetch real-time users"}), 500

@app.route('/')
def root():
    return send_from_directory('static', 'index.html')

@app.route('/sketch.js')
def serve_js():
    return send_from_directory('static', 'sketch.js')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/assets', 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('static/assets', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
