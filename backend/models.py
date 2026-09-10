from pydantic import BaseModel

class AttackConfig(BaseModel):
    attack: str
    target: str
    intensity: str
    packet_rate: int
    duration: int