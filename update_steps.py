from firebase_admin import initialize_app, firestore
from datetime import datetime

# Initialize Firebase
initialize_app(options={'projectId': 'dashboard-55056'})
db = firestore.client()

# Get the current company data
company_ref = db.collection('companies').document('BE93DWq1pTotszXIhSOE')
company_data = company_ref.get().to_dict()

# Keep track of existing steps with different IDs
other_steps = [step for step in company_data['onboarding_steps'] if step['id'] != 'payment']

# Define new setup and onboarding steps (all with id='payment')
setup_steps = [
    {
        'id': 'payment',
        'name': 'Purchase Subscription',
        'description': 'Synthetic Teams accepts Credit Card, ACH and Check payments.',
        'status': 'done',
        'updated_at': '2025-03-04T13:14:50.854147',
        'donelink': 'View Invoice',
        'clickable': True
    },
    {
        'id': 'payment',
        'name': 'Invite Team Members',
        'description': 'Add your team members to the platform',
        'status': 'todo',
        'updated_at': datetime.now().isoformat(),
        'donelink': None,
        'clickable': False
    },
    {
        'id': 'payment',
        'name': 'Complete Security Assessment',
        'description': 'Review and complete the security requirements checklist',
        'status': 'todo',
        'updated_at': datetime.now().isoformat(),
        'donelink': None,
        'clickable': False
    },
    {
        'id': 'payment',
        'name': 'Schedule Kickoff Meeting',
        'description': 'Set up initial kickoff meeting with your implementation team',
        'status': 'done',
        'updated_at': datetime.now().isoformat(),
        'donelink': 'Feb 14th, 2pm ET',
        'clickable': False
    },
    {
        'id': 'payment',
        'name': 'Define Project Goals',
        'description': 'Document your key objectives and success metrics',
        'status': 'done',
        'updated_at': datetime.now().isoformat(),
        'donelink': 'View Goals Doc',
        'clickable': True
    },
    {
        'id': 'payment',
        'name': 'Set Up Access Permissions',
        'description': 'Share your data with Synthetic Teams through Sharepoint, Google Drive or Physical Transfer',
        'status': 'done',
        'updated_at': datetime.now().isoformat(),
        'donelink': 'View Shared Files',
        'clickable': True
    },
    {
        'id': 'payment',
        'name': 'Initial Team Training',
        'description': 'Complete basic platform training for team members',
        'status': 'todo',
        'updated_at': datetime.now().isoformat(),
        'donelink': None,
        'clickable': False
    }
]

# Combine with other existing steps
company_data['onboarding_steps'] = setup_steps + other_steps

# Update in Firestore
company_ref.update(company_data)
print('Updated onboarding steps successfully')
print('\nNew setup and onboarding steps:')
for step in setup_steps:
    donelink_info = f" [Link: {step['donelink']} {'(Clickable)' if step['clickable'] else '(Tag)'}]" if step['donelink'] else ""
    print(f"\n- {step['name']}: {step['description']} (Status: {step['status']}){donelink_info}") 
