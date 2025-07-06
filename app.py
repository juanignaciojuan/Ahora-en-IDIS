from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunRealtimeReportRequest, Dimension, Metric
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import json

load_dotenv()  # Carga variables desde .env si existe

app = Flask(__name__, static_folder='static')
CORS(app)

credentials_json_str = os.environ.get("GA_CREDENTIALS_JSON")
if not credentials_json_str:
    # Modo local: lee el archivo credentials.json
    local_path = "credentials.json"
    if os.path.isfile(local_path):
        with open(local_path, "r") as f:
            credentials_info = json.load(f)
    else:
        raise RuntimeError("GA_CREDENTIALS_JSON not set and credentials.json file not found")
else:
    # En producción: parsea la variable de entorno
    credentials_info = json.loads(credentials_json_str)

credentials = service_account.Credentials.from_service_account_info(credentials_info)

client = BetaAnalyticsDataClient(credentials=credentials)

GA4_PROPERTY_ID = "393664216"

@app.route('/active_users')
def get_realtime_users():
    try:
        request = RunRealtimeReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            dimensions=[
                Dimension(name="unifiedScreenName"),
                Dimension(name="city"),
                Dimension(name="country")
            ],
            metrics=[Metric(name="activeUsers")]
        )
        response = client.run_realtime_report(request)

        active_users = []
        for row in response.rows:
            screen_name = row.dimension_values[0].value.strip()
            city = row.dimension_values[1].value.strip()
            country = row.dimension_values[2].value.strip()

            # Validar que todos los valores existan
            if all(val.lower() not in ["(not set)", "unknown", ""] for val in [screen_name, city, country]):
                active_users.append({
                    "unifiedScreenName": screen_name,
                    "city": city,
                    "country": country
                })

        return jsonify({"active_users": active_users})

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

@app.route('/active_users_count')
def get_realtime_users_count():
    try:
        request = RunRealtimeReportRequest(
            property=f"properties/{GA4_PROPERTY_ID}",
            metrics=[Metric(name="activeUsers")]
        )
        response = client.run_realtime_report(request)

        total_active_users = int(response.rows[0].metric_values[0].value)
        return jsonify({"active_users_count": total_active_users})

    except Exception as e:
        print("Error in get_realtime_users_count:", str(e))
        return jsonify({"error": "Failed to fetch real-time users count"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))  # Use PORT env var or default 8080
    app.run(host='0.0.0.0', port=port, debug=True)