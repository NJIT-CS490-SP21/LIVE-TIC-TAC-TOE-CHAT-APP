"""MODELS"""
from app import DB

class Person(DB.Model):
    """Person"""
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer)

    def __repr__(self):
        return '<Person %r>' % self.username
        