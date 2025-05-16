#!/bin/sh

# Wait for PostgreSQL to become available
#until python manage.py makemigrations --noinput
until python manage.py migrate --noinput
do
    echo "Waiting for db to be ready..."
    sleep 4
done

# Collect static files and folders
echo "Collect all static files..."
python manage.py collectstatic --noinput

exec "$@"
