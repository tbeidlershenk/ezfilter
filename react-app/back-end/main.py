import tkinter as tk

class SimpleGUI:
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
        self.all_options = ['Newsletters', 'College Emails', 'Jobs', 'Verification Emails', 'Venmo Receipts',
                            'Uber Receipts', 'LinkedIn Jobs', 'Social Media']
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

        print(f'Submitting selected options: {selected_options}')

if __name__ == "__main__":
    root = tk.Tk()
    gui = SimpleGUI(root)
    root.mainloop()