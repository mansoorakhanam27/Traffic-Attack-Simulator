import json
import time
import random
import asyncio
import threading
import csv
import os

from paho.mqtt import client as mqtt_client
from websocket import manager

# =====================================================
# MQTT CONFIGURATION
# =====================================================

BROKER = "localhost"
PORT = 1883
CLIENT_ID = "traffic-simulator-backend"

client = mqtt_client.Client(
    mqtt_client.CallbackAPIVersion.VERSION2,
    client_id=CLIENT_ID
)

# =====================================================
# CSV TRAFFIC LOGGER
# =====================================================

LOG_DIR = "logs"
LOG_FILE = os.path.join(LOG_DIR, "traffic_log.csv")

os.makedirs(LOG_DIR, exist_ok=True)

# Create CSV file if it doesn't exist
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            "timestamp",
            "topic",
            "packet_type",
            "payload"
        ])

# =====================================================
# MQTT CALLBACKS
# =====================================================

def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected to MQTT Broker!")
        client.subscribe("farm/#")
    else:
        print(f"Connection failed: {reason_code}")


def on_message(client, userdata, message):
    payload = message.payload.decode()

    print(f"Received [{message.topic}] -> {payload}")

    # ---------------- Save Traffic to CSV ----------------
    try:
        payload_json = json.loads(payload)

        with open(LOG_FILE, "a", newline="") as file:
            writer = csv.writer(file)
            writer.writerow([
                time.time(),
                message.topic,
                payload_json.get("packet_type", "unknown"),
                payload
            ])

    except Exception as e:
        print("CSV Log Error:", e)

    # ---------------- Broadcast to React Dashboard ----------------
    try:
        asyncio.run(
            manager.broadcast(
                {
                    "topic": message.topic,
                    "payload": payload
                }
            )
        )
    except Exception:
        pass


client.on_connect = on_connect
client.on_message = on_message

# =====================================================
# START MQTT CLIENT
# =====================================================

def start_mqtt():
    client.connect(BROKER, PORT)
    client.loop_start()

# =====================================================
# VIRTUAL AGRICULTURAL IOT DEVICES
# =====================================================

DEVICES = [
    ("soil-sensor-01", "farm/soil"),
    ("temp-sensor-01", "farm/temperature"),
    ("humidity-sensor-01", "farm/humidity"),
    ("light-sensor-01", "farm/light"),
    ("irrigation-controller", "farm/irrigation"),
]


def generate_payload(device):
    """Generate realistic sensor readings."""

    if device == "soil-sensor-01":
        return {"soil_moisture": random.randint(30, 80)}

    if device == "temp-sensor-01":
        return {"temperature": round(random.uniform(24, 36), 1)}

    if device == "humidity-sensor-01":
        return {"humidity": random.randint(50, 90)}

    if device == "light-sensor-01":
        return {"light_intensity": random.randint(250, 900)}

    if device == "irrigation-controller":
        return {"pump_status": random.choice(["ON", "OFF"])}

    return {}

# =====================================================
# NORMAL MQTT TRAFFIC GENERATOR
# =====================================================

def publish_test():
    """Continuously publish normal IoT traffic."""

    while True:
        device, topic = random.choice(DEVICES)

        payload = {
            "device": device,
            "packet_type": "normal",
            "timestamp": time.time(),
            **generate_payload(device)
        }

        client.publish(topic, json.dumps(payload))
        print(f"Published [{topic}] -> {payload}")

        time.sleep(1)