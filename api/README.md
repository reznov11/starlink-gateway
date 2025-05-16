# Bakai.kg Proposals API

## Run the app

```bash
docker-compose -f docker-compose.yaml up -d --build
```

## Migrate applications

```bash
docker exec -it superlink-app python manage.py migrate
```

## Collect all static files

```bash
docker exec -it superlink-app python manage.py collectstatic --noinput
```

## Create super user

```bash
docker exec -it superlink-app python manage.py createsuperuser
```

## ENV
```bash
SECRET_KEY=
DEBUG=
ALLOWED_HOSTS=
TRUSTED_HOSTS=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
APP_CONTAINER_EXTERNAL_PORT=
```

## POST request example from a client to create new proposal

```yaml
{
  "firstName": "Иванов",
  "lastName": "Иван",
  "middleName": "Иванович",
  "phoneNumber": "+996555333222",
  "amountInitialPayment": "150000",
  "carInfo":{
    "brandModel": "Subaru Outback",
    "year": "2018",
    "engineVolume": "2500",
    "color": "Белый",
    "price": "600000",
  },
}
```
