from django.contrib.auth.management.commands.createsuperuser import Command as CreateSuperUserCommand
from django.core.management.base import CommandError
from django.utils.text import capfirst


class Command(CreateSuperUserCommand):
    help = 'Create a superuser with a selected role'

    def handle(self, *args, **options):
        options.setdefault('interactive', True)
        database = options.get('database')
        user_data = {}

        field_names = ['username', 'email', 'password']
        required_fields = [f for f in self.UserModel.REQUIRED_FIELDS if f not in field_names]
        field_names += required_fields

        field_names.append('role')

        try:
            if options.get('interactive', True):
                for field_name in field_names:
                    if field_name == 'role':
                        continue  # We'll handle role separately
                    
                    field = self.UserModel._meta.get_field(field_name)
                    user_data[field_name] = options.get(field_name)
                    while user_data[field_name] is None:
                        message = self._get_input_message(field)
                        input_value = self.get_input_data(field, message)
                        user_data[field_name] = input_value

                if options.get('role') is not None:
                    user_data['role'] = options['role']
                else:
                    self.stdout.write("\nAvailable roles:")
                    for i, (role_key, role_name) in enumerate(self.UserModel.ROLE_CHOICES, 1):
                        self.stdout.write(f"{i}. {role_name} ({role_key})")
                    
                    while True:
                        try:
                            selected = input("Select role [1-%d]: " % len(self.UserModel.ROLE_CHOICES))
                            selected_index = int(selected) - 1
                            if 0 <= selected_index < len(self.UserModel.ROLE_CHOICES):
                                user_data['role'] = self.UserModel.ROLE_CHOICES[selected_index][0]
                                break
                            else:
                                self.stdout.write("Error: Please enter a number between 1 and %d" % len(self.UserModel.ROLE_CHOICES))
                        except ValueError:
                            self.stdout.write("Error: Please enter a valid number")
            else:
                for field_name in field_names:
                    if options.get(field_name) is not None:
                        user_data[field_name] = options[field_name]
                    else:
                        raise CommandError("You must use --%s with --noinput." % field_name)

        except KeyboardInterrupt:
            self.stderr.write("\nOperation cancelled.")
            return
        except Exception as e:
            raise CommandError("Error: %s" % e)

        original_role = user_data.get('role')
        user_data['role'] = self.UserModel.ROLE_SUPER_ADMIN

        self.UserModel._default_manager.db_manager(database).create_superuser(**user_data)
        
        if options.get('verbosity', 1) >= 1:
            self.stdout.write(
                f"Superuser created successfully with ROLE_SUPER_ADMIN "
                f"(selected role was: {original_role})."
            )