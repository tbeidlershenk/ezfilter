import tkinter as tk
from filter import Filter
from api_calls import load_credentials_from_file, add_all_filters

class SimpleGUI:
    filters = [
        Filter(query="Job OR thank you for your interest OR thank you for applying OR", label='TRASH'),
        Filter(query="Facebook OR Instagram OR Snapchat OR LinkedIn", label="Social Media"),
        Filter(query="(application OR applying OR update) AND (\"thank you for your interest\" OR \"after careful review\" OR \"after reviewing\" OR \"has been filled\" OR \"while we were impressed\" OR \"after reviewing your application\" OR \"after careful consideration\" OR \"at this time, we have decided\" OR \"proceed with other candidates\" OR \"unfortunately, we have decided\" OR \"other candidates at this time\")",
               label="Application Updates")
    ]

    def __init__(self, master):
        self.master = master
        master.title("EzFilter")

        # Set the initial size of the window
        master.geometry("500x400")  # Change the dimensions as needed

        # Create and place the search label next to the entry
        self.search_label = tk.Label(master, text='SEARCH:')
        self.search_label.grid(row=0, column=0, padx=5, pady=(10, 0), sticky='e')

        # Create and place the search box
        self.search_var = tk.StringVar()
        self.search_entry = tk.Entry(master, textvariable=self.search_var)
        self.search_entry.grid(row=0, column=1, padx=10, pady=(10, 0), sticky='ew')

        # Create and place checkboxes in a centered frame
        self.checkboxes_frame = tk.Frame(master)
        self.checkboxes_frame.grid(row=1, column=0, columnspan=2, padx=10, pady=(0, 10), sticky='nsew')

        self.checkbox_vars = []
        self.checkboxes = []
        self.all_options = []
        for filter in self.filters:
            self.all_options.append(filter.label)

        for i, option in enumerate(self.all_options):
            var = tk.StringVar(value='0')  # Initially set all checkboxes to unselected
            checkbox = tk.Checkbutton(self.checkboxes_frame, text=option, variable=var)
            checkbox.grid(row=i, column=0, pady=5, sticky='w')
            self.checkbox_vars.append(var)
            self.checkboxes.append(checkbox)

        # Create and place the submit button at the bottom
        self.submit_button_bottom = tk.Button(master, text='SUBMIT', command=self.on_submit_bottom)
        self.submit_button_bottom.grid(row=2, column=0, columnspan=2, padx=10, pady=(0, 10), sticky='ew')

        # Bind the on_search_top method to the search entry variable trace
        self.search_var.trace_add('write', lambda *args: self.on_search_top())

    def on_search_top(self, *args):
        search_text = self.search_var.get().lower()

        # Remove all checkboxes from the frame
        for checkbox in self.checkboxes_frame.winfo_children():
            checkbox.grid_forget()

        # Create and place only the relevant checkboxes based on the search input
        if not search_text:
            # Display all checkboxes if search text is empty
            for i, (option, var) in enumerate(zip(self.all_options, self.checkbox_vars)):
                checkbox = tk.Checkbutton(self.checkboxes_frame, text=option, variable=var)
                checkbox.grid(row=i, column=0, pady=5, sticky='w')
        else:
            # Display filtered checkboxes based on the search input
            for i, (option, var) in enumerate(zip(self.all_options, self.checkbox_vars)):
                if search_text in option.lower():
                    checkbox = tk.Checkbutton(self.checkboxes_frame, text=option, variable=var)
                    checkbox.grid(row=i, column=0, pady=5, sticky='w')

    def on_submit_bottom(self):
        selected_options = [
            option for var, option, checkbox in zip(self.checkbox_vars, self.all_options, self.checkboxes)
            if var.get() == '1'
        ]
        selected_filters = []
        for option in selected_options:
            for filter in self.filters:
                if filter.label == option:
                    selected_filters.append(filter)

        creds = load_credentials_from_file()
        add_all_filters(creds, selected_filters)
        print(f'Submitting selected options: {selected_options}')

if __name__ == "__main__":
    root = tk.Tk()
    gui = SimpleGUI(root)
    root.mainloop()