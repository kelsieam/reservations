
from model import db, User, Reservation, connect_to_db


def create_user(username, name):
    user = User(username=username, name=name)

    return user

def create_reservation(start, user_id):
    reservation = Reservation(start=start, user_id=user_id)

    return reservation


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
