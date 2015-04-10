
GRIDSPREE
-------------

Use Google Spreadsheets as your CMS. Display your spreadsheet data however you like right on your static site.


## How it works

Connect your Google Spreadsheet to Gridspree. Then you can use mustache templates to display your data, or post new data with a form.

#### Easily display spreadsheet data:

    <script src="https://gridspree.io/ss/READ_KEY.js"></script>

    <script type="x-gridspree-template">
      <ul>
        {{#rows}}
          <li>
            {{Price}},
            {{Title}}, 
            {{Quantity}}
          </li>
        {{/rows}}
      </ul>
    </script>

#### Post new entries:

    <form action="https://gridspree.io/ss/WRITE_KEY" method="POST">
        <input type="text" name="Price">
        <input type="text" name="Title">
        <input type="text" name="Quantity">
        <input type="submit" value="Send">
    </form>


## Some questions you might have:

#### What about privacy?

We don't store the contents of your spreadsheet. Instead we generate two access keys that link our APIs to your spreadsheet, one for reading and one for writing. You can delete these keys at any time to revoke access.

#### How much does it cost?

Gridspree is free for 1000 API calls per spreadsheet each month. If you need more, please reach out.

#### Are there any limits?

Yep, for now we cap API calls to 1000 per spreadsheet for each month. If you need more, please reach out to team@gridspree.io.

--------

Running your own copy of Gridspree 
------------------------------------

### Running on localhost

You'll need python 2.7 and should [install pip](https://pip.pypa.io/en/latest/installing.html), and create a [virtual environment](http://docs.python-guide.org/en/latest/dev/virtualenvs/) for the server. 

Once your environment is setup, clone the source and cd into the root of the Gridspree repository. Then run:

    pip install -r requirements.txt

then

    python manage.py runserver


### Running on heroku

You will need to install the [heroku toolbelt](https://toolbelt.heroku.com/).

Once your environment is setup, clone the source and cd into the root of the Gridspree repository. Then run:

    heroku app:create [your project name]

then

    git push heroku

Your new project will be running at [your project name].herokuapp.com.


### Dependencies

Gridspree requires Redis and MongoDB. If you're deploying to heroku you can get an addons, such as redistogo and mongohq. To install redistogo and mongohq into your project just run the commands:

    heroku addons:add redistogo
    heroku addons:add mongohq


Gridspree also requires a google developer credentials with the following APIs enabled:

    Google Cloud Storage JSON API
    Google+ API


### Configuring Gridspree

Take a look at the `main/settings.py` file for a list of environment variables that should be set in order for Data to work correctly.

#### Setup OAuth2

- goto: https://console.developers.google.com/project
- Click "Create Project" - 
-  enter a "Project Name",  and select an account
- Click "Create" 
- on the left expand "APIs & auth" -> APIs
- find "Drive API" and enable it
- find "Google Picker API" and enable it
- find "Google+ API" and enable it
- You should now have 8 APIs - BigQuery API, Debuglet Controller API, Drive API, Google Cloud SQL,
Google Cloud Storage, Google Cloud Storage JSON API, Google Picker API, Google+ API

- on the left expand  "APIs & auth" -> "credential"
- Click "Create new Client ID"
- Select "web application" and Click "Configure consent screen"
- Select an "email address" and enter a "Product name"
- Click "Save"
- Click "Create Client ID"
- set the "Redirect URIs"  e.g. for testing  http://127.0.0.1:5000/auth/authorize
- set "Javascript Origins" e.g. for testing http://127.0.0.1:5000/

- Under "Public API access" click "Create new Key"
- Click "Browser Key"
- set "Referers"  e.g. for testing http://127.0.0.1:5000/*

#### Set the environment vars 
- GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.comDEBUG=true
- GOOGLE_CLIENT_SECRET=xxxxxxxxxx
- GOOGLE_BROWSER_API_KEY=xxxxxxxxxx 
- API_ROOT=http://127.0.0.1:5000/ss
- SERVICE_URL=http://127.0.0.1:5000
- SECRET_KEY=xxxx-mongodb key
