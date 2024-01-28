class Label:
    label_list_visibility = 'labelShow'
    message_list_visibility = 'show'
    name: str

    def to_dict(self):
        return {
            "labelListVisibility": self.label_list_visibility,
            "messageListVisibility": self.message_list_visibility,
            "name": self.name,
        }
