from app import create_app

app = create_app()

if __name__ == '__main__':
    from gevent.pywsgi import WSGIServer
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    print("Backend server starting on http://0.0.0.0:5000")
    http_server.serve_forever()