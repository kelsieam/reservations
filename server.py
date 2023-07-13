from flask import (Flask, render_template, request, flash, session, redirect, url_for)
from jinja2 import StrictUndefined
from model import connect_to_db, db, User, Reservation
from crud import create_user, create_reservation
from datetime import date, datetime
from sqlalchemy import func, text, cast, String



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
        
        # user_reservations = (Reservation.query
        #     .from_statement(text("SELECT *, start::text AS start_no_tz FROM reservations WHERE user_id=:user_id"))
        #     .params(user_id=user_id)
        #     .all()
        # )
        reservations = []
        for reservation in user_reservations:
            print(reservation.start)
            # dt = datetime.strptime(str(reservation.start), '%a, %d %b %Y %H:%M:%S')
            # formatted_dt = dt.strftime('%Y-%m-%d %H:%M:%S')
            # reservation.start = formatted_dt

        for reservation in user_reservations:
            reservations.append(reservation.as_dict())
        # print(reservations)
        return {'first_name': first_name, 'reservations': reservations}
    
    return redirect('/login')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':    
        username = request.form.get('username')
        user = User.query.filter_by(username=username).first()

        if user:
            session['username'] = username
            print(session['username'])
            return redirect('/search')
        
        return {'success': False, 'message': 'No user by that name'}
    

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        return render_template('search.html')
    
    if request.method == 'POST':
        selected_date = request.form.get('date')
        # print(selected_date)
        start_time = request.form.get('start-time')
        end_time = request.form.get('end-time')
        # print(selected_date, 'selected_date')
        reservations_on_date = Reservation.query.filter(Reservation.start.like(f'{selected_date}%')).all()
        # print(reservations_on_date, 'reservations_on_date')
        reservations = []
        for reservation in reservations_on_date:
            reservations.append(reservation.as_dict())
        return {'reservations': reservations, 'start_time': start_time, 'end_time': end_time, 'date': selected_date}


@app.route('/make-reservation/<datetime>', methods=['POST'])
def make_reservation(datetime):
    
    current_user = User.query.filter_by(username=session['username']).first()
    user_id = current_user.user_id
    reservation = create_reservation(datetime, user_id)

    db.session.add(reservation)
    db.session.commit()

    return {'success': True, 'message': 'Time reserved'}


# @app.route('/schedule', methods=['GET', 'POST'])
# def schedule():
#     if request.method == 'GET':
#         return render_template('schedule.html')
    
#     if request.method == 'POST':
#         pass


# @app.route('/search-results', methods=['GET', 'POST'])
# def search_results():
#     if request.method == 'GET':
#         return render_template('search-results.html')
    
#     if request.method == 'POST':
#         pass



if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
