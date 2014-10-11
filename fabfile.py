import fabric
import fabric.api

# I have disabled all of this because Daniel is also pushing.as
#
# For now, we'll specify host/user interactively.
#
# Eventually I think we want dynamically-set host lists from a settings file:
#
# http://docs.fabfile.org/en/latest/usage/execution.html
#
# configs = {
#     'jfogarty': {'hosts': ['barb.cs.washington.edu'], 'user': 'jfogarty'},
#     'depstein': {'hosts': ['bicycle.cs.washington.edu'], 'user': 'depstein'}
# }
#
# # Configure our host and user according to the parameter
# fabric.api.env.hosts = configs[param_config]['hosts']
# fabric.api.env.user = configs[param_config]['user']
#
# fabric.api.env.hosts = ['jfogarty@barb.cs.washington.edu']


def build():
    fabric.api.local('jekyll build --config _config.yml')


def deploy():
    # Locally build the website
    fabric.api.local('jekyll build --config _config.yml')

    # Ensure the server has our staging directory
    fabric.api.run('mkdir -p ~/fabric_staging/web-cse440-au14/')

    # Ensure the staging directory is empty
    fabric.api.run('rm -rf ~/fabric_staging/web-cse440-au14/*')

    # Push up to the server staging directory
    fabric.api.put('_site/*', '~/fabric_staging/web-cse440-au14/')

    # And sync into the deployment directory
    fabric.api.run('rsync -r -c --delete ~/fabric_staging/web-cse440-au14/ /cse/web/courses/cse440/14au/')


def serve():
    fabric.api.local('jekyll serve --config _config.yml,_config-dev.yml --watch --force_polling')


# We cannot have a test because Fabric requires Python 2.7 but our tests use Python 3.4
#
# def test():
#    fabric.api.local('nosetests')
