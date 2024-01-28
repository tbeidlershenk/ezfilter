class Filter:
    query: str
    from_user: str
    label: str

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

