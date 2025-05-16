import os
import logging
from datetime import datetime
from django.conf import settings


def setup_logging_folder(module: str):
    """
    Set up the logging folder for a given module.

    Args:
        module (str): The name of the module for which the logging folder is being set up.

    Returns:
        str: The path to the logging folder.

    This function creates a logging folder for a given module by first checking if the module folder
    exists in the logging base directory specified in the settings.
    
    If the module folder does not exist, it is created. Then, the current date is obtained
    and used to create subdirectories for the year, month, and day within the module folder.

    If any of these subdirectories do not exist, they are created.

    Finally, the function returns the path to the logging folder.

    Example:
        >>> setup_logging_folder("my_module")
        'logs/my_module/2024/01/01'
    """
    module_folder = os.path.join(settings.LOGGING_BASE, module)

    if not os.path.exists(module_folder):
        os.makedirs(module_folder)

    now = datetime.now()
    day, month, year = now.day, now.month, now.year

    log_folder = os.path.join(module_folder, str(year), str(month), str(day))

    if not os.path.exists(log_folder):
        os.makedirs(log_folder)

    return log_folder


def log_app(module: str = __name__, is_specific_module_log: bool = False):
    """
    A function to set up logging for the specified module. 
    :param module: str, the name of the module for which to set up logging (default is __name__)
    :param is_specific_module_log: bool, whether to set up specific logging for the module (default is False)
    :return: logger, the logger object for the specified module
    """
    logger = logging.getLogger(module)

    if is_specific_module_log:
        logger.setLevel(logging.DEBUG)

        log_folder = setup_logging_folder(module=module)

        dtime = datetime.now()
        current_time = f'{dtime:%H_%M_%S}'

        log_file = os.path.join(log_folder, f"{current_time}__{module}.log")
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)

        log_format = '\n%(asctime)s [%(levelname)s/process_id=%(process)d/(%(thread)d)] ' \
                    '%(name)s.%(funcName)s: \n %(message)s \n %(exc_info)s \n'
        logging.Formatter(log_format)

        # Remove existing file handlers to avoid duplicates
        for handler in logger.handlers:
            if isinstance(handler, logging.FileHandler):
                logger.removeHandler(handler)

        logger.addHandler(file_handler)

    return logger
