# Use Python base
FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 8080

CMD ["python", "app.py"]
