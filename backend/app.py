from fastapi import FastAPI
import threading
from fastapi.middleware.cors import CORSMiddleware
from attacks.dos_attack import start_dos_attack, stop_dos_attack
from mqtt_client import start_mqtt, publish_test
from attacks.spoof_attack import start_spoof_attack, stop_spoof_attack
from attacks.replay_attack import start_replay_attack, stop_replay_attack
from attacks.false_command import (
    start_command_attack,
    stop_command_attack
)
from attacks.mitm_attack import start_mitm_attack, stop_mitm_attack
from websocket import manager
from fastapi import WebSocket
from models import AttackConfig
import threading
import time

app = FastAPI(title="Traffic Attack Simulator API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def startup():
    start_mqtt()

    thread = threading.Thread(target=publish_test, daemon=True)
    thread.start()

@app.get("/")
def home():
    return {"project": "Traffic Attack Simulator", "status": "Running"}

@app.get("/api/status")
def status():
    return {"backend": "online", "mqtt": "connected"}

@app.post("/attack/spoof/start")
def start_attack():
    start_spoof_attack()
    return {"attack": "MQTT Spoofing Started"}

@app.post("/attack/spoof/stop")
def stop_attack():
    stop_spoof_attack()
    return {"attack": "MQTT Spoofing Stopped"}
@app.post("/attack/replay/start")
def replay_start():
    start_replay_attack()
    return {"attack": "Replay Attack Started"}

@app.post("/attack/replay/stop")
def replay_stop():
    stop_replay_attack()
    return {"attack": "Replay Attack Stopped"}
@app.post("/attack/dos/start")
def dos_start(rate: int = 100):
    start_dos_attack(rate)
    return {"attack": "DoS Attack Started", "packets_per_second": rate}

@app.post("/attack/dos/stop")
def dos_stop():
    stop_dos_attack()
    return {"attack": "DoS Attack Stopped"}
@app.post("/attack/command/start")
def command_start():
    start_command_attack()
    return {"attack": "False Command Injection Started"}

@app.post("/attack/command/stop")
def command_stop():
    stop_command_attack()
    return {"attack": "False Command Injection Stopped"}
@app.post("/attack/mitm/start")
def mitm_start():
    start_mitm_attack()
    return {"attack": "MITM Attack Started"}

@app.post("/attack/mitm/stop")
def mitm_stop():
    stop_mitm_attack()
    return {"attack": "MITM Attack Stopped"}

@app.websocket("/ws/traffic")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()
    except:
        manager.disconnect(websocket)
@app.post("/attack/configure")
def configure_attack(config: AttackConfig):

    if config.attack == "dos":
        start_dos_attack(config.target, config.packet_rate)

    elif config.attack == "spoof":
        start_spoof_attack()

    elif config.attack == "replay":
        start_replay_attack()

    elif config.attack == "mitm":
        start_mitm_attack()

    elif config.attack == "command":
        start_command_attack()

    # Auto stop after selected duration
    if config.duration > 0:

        def timer():
            time.sleep(config.duration)

            if config.attack == "dos":
                stop_dos_attack()

            elif config.attack == "spoof":
                stop_spoof_attack()

            elif config.attack == "replay":
                stop_replay_attack()

            elif config.attack == "mitm":
                stop_mitm_attack()

            elif config.attack == "command":
                stop_command_attack()

        threading.Thread(target=timer, daemon=True).start()

    return {
        "status": "started",
        "attack": config.attack,
        "target": config.target,
        "rate": config.packet_rate,
        "duration": config.duration,
    }