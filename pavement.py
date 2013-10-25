import sys
import os
import shutil
import string

from paver.easy import *
from paver.path import path

# Add the current path to the path
sys.path.append(os.path.abspath('.'))

# Paver Libs
paverlibs_path = '_build'   # Default path

try:
    # Try to import a file containing local variables
    from pavement_local import *
except:
    pavement_local = None

# Append the paver-libs path so we can load the tasks
sys.path.append(os.path.abspath(paverlibs_path))

@task
def update():
    ''' Updates code to the latest committed revision. '''

    update_cmd = [
        'git pull'
    ]

    sh(string.join(update_cmd, ' ').format(**config))
    refresh_paverlibs()

@task
def clean(info):
    ''' Cleans out the solution /bin, /obj/, and other folders. '''
    if path('bin').exists(): sh('rmdir /S /Q bin')
    if path('obj').exists(): sh('rmdir /S /Q obj')
    if path('Tests/bin').exists(): sh(r'rmdir /S /Q Tests\bin')
    if path('Tests/obj').exists(): sh(r'rmdir /S /Q Tests\obj')
    if path('packages').exists(): sh(r'rmdir /S /Q packages')
    if path('_js/app').exists(): sh(r'rmdir /S /Q _js\app')
    if path('_deploy').exists(): sh(r'rmdir /S /Q _deploy')
    if path(config['package.package_path']).exists(): sh(r'rmdir /S /Q ' + config['package.package_path'])

    sh('git checkout -- .')
    info('Cleanup complete!')


@task
@needs('update', 'package', 'deploy', 'clean')
def all():
    ''' Builds the project, runs the tests, and deploys to the target. '''
    pass


@task
def wait():
    ''' Waits for the user to press a key '''

    raw_input()

def refresh_paverlibs():
    if (os.path.exists(paverlibs_path)):
        sh('git pull origin master',cwd=paverlibs_path)
    else:
        sh('git clone git@bitbucket.org:simpleltc/paver-libs.git {0}'.format(paverlibs_path))

### All custom tasks go above this line

try:
    # Load Paver Tasks (this is where you import any paver tasks you need)
    from tasks.config_tools import load_project_config, load_local_config, pull_config, config, load_task_defaults
    from tasks.msbuild import make, test
    from tasks.closure_compiler import build_js
    from tasks.mssql_localdb import reset_db
    from tasks.aspnet import package, deploy, start
except ImportError:
    # Remove the legacy build folder
    if (os.path.exists('build')):
        shutil.rmtree('build')

    # If the paver-libs path exists, make sure it is up to date
    refresh_paverlibs()

    # Tell the user to try again
    error ("Whoops! Couldn't import the paver-libs modules! We have attempted to load paver-libs for you. Please try running the command again.")
    sys.exit(1)

load_task_defaults(locals())
load_project_config()
load_local_config()