from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', qwe = 123, eco=11)

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/tasks')
def tasks():
    return render_template('tasks.html')

@app.route('/friends')
def friends():
    return render_template('friends.html')

@app.route('/upgrade')
def upgrade():
    return render_template('upgrade.html')

if __name__ == '__main__':
    app.run(debug=True)
