#!/bin/bash
gunicorn -w 4 -b 10.100.8.142:5000 app:app
