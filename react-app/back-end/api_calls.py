import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from label import Label
from filter import Filter

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://mail.google.com/", "https://www.googleapis.com/auth/gmail.settings.basic"]
CLIENT_FILE = 'client.json'

def load_credentials_from_file():
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_FILE, SCOPES)
        creds = flow.run_local_server(port = 0)
    with open('token.json', 'w') as token:
        token.write(creds.to_json())
    return creds

def get_labels(creds) -> []:
    service = build('gmail', 'v1', credentials=creds)
    response = service.users().labels().list(userId='me').execute()['labels']
    label_name_to_id = {}
    for label in response:
        id = label['id']
        name = label['name']
        label_name_to_id[name] = id
    return label_name_to_id

def add_label(creds, label: Label) -> bool:
    service = build('gmail', 'v1', credentials=creds)
    try:
        service.users().labels().create(userId='me', body=label.to_dict()).execute()
        return True
    except Exception as e:
        print(e)
        print(f'Failed to create label {label.to_dict()}')
        return False

def add_filter(creds, filter: Filter, ) -> bool:
    service = build('gmail', 'v1', credentials=creds)
    try:
        print(service.users().settings().filters().create(userId='me', body=filter.to_dict()).execute())
        return True
    except Exception as e:
        print(e)
        print(f'Failed to create filter {filter.to_dict()}')
        return False
    
def add_all_filters(creds, filters: []):
    service = build('gmail', 'v1', credentials=creds)
    label_name_to_id = get_labels(creds)
    for filter in filters:
        label_name = filter.label
        created_label = False
        created_filter = False
        if label_name in label_name_to_id.keys():
            filter.label = label_name_to_id[label_name]
            created_filter = add_filter(creds, filter)
        else:
            new_label = Label()
            new_label.name = label_name
            created_label = add_label(creds, new_label)
            label_name_to_id = get_labels(creds)
            filter.label = label_name_to_id[label_name]
            created_filter = add_filter(creds, filter)
        if created_label:
            print("created label")
        if created_filter:
            print("created filter")

creds = load_credentials_from_file()
# print(get_labels(creds))
filter = Filter()
filter.query = "test2"
filter.from_user = "your momma 2"
filter.label = "testing"
add_all_filters(creds, filters= [filter])
