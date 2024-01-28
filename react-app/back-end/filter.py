class Filter:
    query: str
    from_user: str
    label: str

    def __init__(self, query, label, from_user=None):
        self.query = query
        self.from_user = from_user
        self.label = label

    def to_dict(self):
        return {
            "criteria": {
                "from": self.from_user,
                "query": self.query
            },
            "action": {
                "addLabelIds": [self.label]
            }
        }

