from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):

    def as_dict(self):
        return {
            'user_id': self.user_id,
            'username': self.username,
            'name': self.name
        }

    __tablename__ = 'users'

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    username = db.Column(db.String,
                unique=True)
    name = db.Column(db.String)

    reservations = db.relationship('Reservation', back_populates='user')

    def __repr__(self):
        return f'<User user_id={self.user_id}, username={self.username}>'


class Reservation(db.Model):

    def as_dict(self):
        return {
            'reservation_id': self.reservation_id,
            'start': self.start,
            'user_id': self.user_id
        }

    __tablename__ = 'reservations'

    reservation_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)
    # saving datetime as a string so it doesn't apply a timezone
    start = db.Column(db.String, 
                      nullable=False,
                      unique=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey('users.user_id'))
    
    user = db.relationship('User', back_populates='reservations')

    def __repr__(self):
        return f'<Reservation reservation_id={self.reservation_id}, start={self.start}>'



def connect_to_db(flask_app, db_uri="postgresql:///reservations", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


# with app.app_context():
#     db.create_all()



if __name__ == "__main__":
    from server import app

    connect_to_db(app)