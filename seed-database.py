import os
# import json
from datetime import datetime

from crud import create_user, create_reservation
from model import db, connect_to_db, User, Reservation
import server


os.system('dropdb reservations')
os.system('createdb reservations')

connect_to_db(server.app)

with server.app.app_context():
    # server.create_app()
    db.create_all()


    users = [
        create_user('user1', 'Bob'),
        create_user('user2', 'Linda'),
        create_user('user3', 'Gene'),
        create_user('user4', 'Tina'),
        create_user('user5', 'Louise')
    ]

    db.session.add_all(users)
    db.session.commit()


    reservations = [
        create_reservation('2023-07-27 20:30:00', 1),
        create_reservation('2023-07-28 20:00:00', 1),
        create_reservation('2023-07-27 19:00:00', 2),
        create_reservation('2023-07-29 19:30:00', 2),
        create_reservation('2023-07-30 20:00:00', 2),
        create_reservation('2023-07-26 19:00:00', 3),
        create_reservation('2023-07-28 20:30:00', 3),
        create_reservation('2023-07-29 20:00:00', 4),
        create_reservation('2023-07-27 18:30:00', 5),
        create_reservation('2023-07-15 13:00:00', 3),
        create_reservation('2023-07-15 14:30:00', 1),
        create_reservation('2023-07-15 18:00:00', 2),
        create_reservation('2023-07-15 20:30:00', 4),
        create_reservation('2023-07-15 21:00:00', 5),
        create_reservation('2023-07-15 21:30:00', 3),
        create_reservation('2023-07-16 08:00:00', 1),
        create_reservation('2023-07-16 10:30:00', 4),
        create_reservation('2023-07-16 12:00:00', 2),
        create_reservation('2023-07-16 15:00:00', 5),
        create_reservation('2023-07-16 17:30:00', 3),
        create_reservation('2023-07-16 18:00:00', 1),
        create_reservation('2023-07-16 19:30:00', 4),
        create_reservation('2023-07-16 20:30:00', 2),
        create_reservation('2023-07-17 09:30:00', 5),
        create_reservation('2023-07-17 12:30:00', 2),
        create_reservation('2023-07-17 14:30:00', 1),
        create_reservation('2023-07-17 16:30:00', 3),
        create_reservation('2023-07-17 18:30:00', 4),
        create_reservation('2023-07-17 20:00:00', 5),
        create_reservation('2023-07-18 08:30:00', 4),
        create_reservation('2023-07-18 10:00:00', 2),
        create_reservation('2023-07-18 13:00:00', 1),
        create_reservation('2023-07-18 15:30:00', 3),
        create_reservation('2023-07-18 17:00:00', 5),
        create_reservation('2023-07-18 18:30:00', 4),
        create_reservation('2023-07-18 19:00:00', 2),
        create_reservation('2023-07-18 20:30:00', 1),
        create_reservation('2023-07-19 08:00:00', 3),
        create_reservation('2023-07-19 10:30:00', 5),
        create_reservation('2023-07-19 12:00:00', 4),
        create_reservation('2023-07-19 14:30:00', 2),
        create_reservation('2023-07-19 16:00:00', 1),
        create_reservation('2023-07-19 18:30:00', 3),
        create_reservation('2023-07-19 19:00:00', 5),
        create_reservation('2023-07-19 20:30:00', 4),
        create_reservation('2023-07-20 08:30:00', 2),
        create_reservation('2023-07-20 10:00:00', 3),
        create_reservation('2023-07-20 13:00:00', 5),
        create_reservation('2023-07-20 14:30:00', 4),
        create_reservation('2023-07-20 17:00:00', 1),
        create_reservation('2023-07-20 18:30:00', 2),
        create_reservation('2023-07-20 20:00:00', 3),
        create_reservation('2023-07-21 00:00:00', 5),
        create_reservation('2023-07-21 00:30:00', 1),
        create_reservation('2023-07-21 01:00:00', 2),
        create_reservation('2023-07-21 01:30:00', 3),
        create_reservation('2023-07-21 02:00:00', 4),
        create_reservation('2023-07-21 02:30:00', 5),
        create_reservation('2023-07-21 03:00:00', 1),
        create_reservation('2023-07-21 03:30:00', 2),
        create_reservation('2023-07-21 04:00:00', 3),
        create_reservation('2023-07-21 04:30:00', 4),
        create_reservation('2023-07-21 05:00:00', 5),
        create_reservation('2023-07-21 05:30:00', 1),
        create_reservation('2023-07-21 06:00:00', 2),
        create_reservation('2023-07-21 06:30:00', 3),
        create_reservation('2023-07-21 07:00:00', 4),
        create_reservation('2023-07-21 07:30:00', 5),
        create_reservation('2023-07-21 08:00:00', 1),
        create_reservation('2023-07-21 08:30:00', 2),
        create_reservation('2023-07-21 09:00:00', 3),
        create_reservation('2023-07-21 09:30:00', 4),
        create_reservation('2023-07-21 10:00:00', 5),
        create_reservation('2023-07-21 10:30:00', 1),
        create_reservation('2023-07-21 11:00:00', 2),
        create_reservation('2023-07-21 11:30:00', 3),
        create_reservation('2023-07-21 12:00:00', 4),
        create_reservation('2023-07-21 12:30:00', 5),
        create_reservation('2023-07-21 13:00:00', 1),
        create_reservation('2023-07-21 13:30:00', 2),
        create_reservation('2023-07-21 14:00:00', 3),
        create_reservation('2023-07-21 14:30:00', 4),
        create_reservation('2023-07-21 15:00:00', 5),
        create_reservation('2023-07-21 15:30:00', 1),
        create_reservation('2023-07-21 16:00:00', 2),
        create_reservation('2023-07-21 16:30:00', 3),
        create_reservation('2023-07-21 17:00:00', 4),
        create_reservation('2023-07-21 17:30:00', 5),
        create_reservation('2023-07-21 18:00:00', 1),
        create_reservation('2023-07-21 18:30:00', 2),
        create_reservation('2023-07-21 19:00:00', 3),
        create_reservation('2023-07-21 19:30:00', 4),
        create_reservation('2023-07-21 20:00:00', 5),
        create_reservation('2023-07-21 20:30:00', 1),
        create_reservation('2023-07-21 21:00:00', 2),
        create_reservation('2023-07-21 21:30:00', 3),
        create_reservation('2023-07-21 22:00:00', 4),
        create_reservation('2023-07-21 22:30:00', 5),
        create_reservation('2023-07-21 23:00:00', 1),
        create_reservation('2023-07-21 23:30:00', 2),
        create_reservation('2023-07-22 00:00:00', 3),
        create_reservation('2023-07-22 00:30:00', 4),
        create_reservation('2023-07-22 01:00:00', 5),
        create_reservation('2023-07-22 01:30:00', 1),
        create_reservation('2023-07-22 02:00:00', 2),
        create_reservation('2023-07-22 02:30:00', 3),
        create_reservation('2023-07-22 03:00:00', 4),
        create_reservation('2023-07-22 03:30:00', 5),
        create_reservation('2023-07-22 04:00:00', 1),
        create_reservation('2023-07-22 04:30:00', 2),
        create_reservation('2023-07-22 05:00:00', 3),
        create_reservation('2023-07-22 05:30:00', 4),
        create_reservation('2023-07-22 06:00:00', 5),
        create_reservation('2023-07-22 06:30:00', 1),
        create_reservation('2023-07-22 07:00:00', 2),
        create_reservation('2023-07-22 07:30:00', 3),
        create_reservation('2023-07-22 08:00:00', 4),
        create_reservation('2023-07-22 08:30:00', 5),
        create_reservation('2023-07-22 09:00:00', 1),
        create_reservation('2023-07-22 09:30:00', 2)
    ]

    db.session.add_all(reservations)
    db.session.commit()

