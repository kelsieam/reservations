from flask import (Flask, render_template, request, session, redirect)
from jinja2 import StrictUndefined
from model import connect_to_db, db, User, Reservation
from crud import create_reservation
from datetime import datetime
from sqlalchemy import and_

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route('/user', methods=['GET'])
def user_info():
    if 'username' in session and session['username']:
        current_user = User.query.filter_by(username=session['username']).first()
        first_name = current_user.name
        user_id = current_user.user_id

        user_reservations = Reservation.query.filter_by(user_id=user_id).all()
        
        reservations = []

        for reservation in user_reservations:
            reservations.append(reservation.as_dict())

        return {'first_name': first_name, 'reservations': reservations}
    
    return redirect('/')


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        print(username)
        user = User.query.filter_by(username=username).first()
        print(user)

        if user:
            session['username'] = username
            return redirect('/search')
        else:
            return {'success': False, 'message': 'No user by that name'}
    
    return render_template('login.html')


@app.route('/search', methods=['GET'])
def search():
    if session['username'] and 'username' in session:
        return render_template('search.html')
    return redirect('/')


@app.route('/search/<start_end>', methods=['POST'])
def get_reservations(start_end):
    """retrieves all reservations in the given time frame"""
    
    selected_date, start_time, end_time = start_end.split('---')
    # reformatting UTC times to match the database format
    dt_start = datetime.strptime(start_time, '%a, %d %b %Y %H:%M:%S %Z')
    start = dt_start.strftime('%Y-%m-%d %H:%M:%S')
    dt_end = datetime.strptime(end_time, '%a, %d %b %Y %H:%M:%S %Z')
    end = dt_end.strftime('%Y-%m-%d %H:%M:%S')
    
    reservations_on_date = db.session.query(Reservation).filter(
                                and_(
                                Reservation.start >= start,
                                Reservation.start <= end)
                            ).all()
    print(reservations_on_date, 'reservations on date')
    reservations = []
    for reservation in reservations_on_date:
        reservations.append(reservation.as_dict())
    return {'reservations': reservations, 'start_time': start, 'end_time': end, 'date': selected_date}



@app.route('/make-reservation/<datetime>', methods=['POST'])
def make_reservation(datetime):
    """saves a new reservation to the database"""

    current_user = User.query.filter_by(username=session['username']).first()
    user_id = current_user.user_id
    reservation = create_reservation(datetime, user_id)

    db.session.add(reservation)
    db.session.commit()

    return {'success': True, 'message': 'Time reserved'}


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
