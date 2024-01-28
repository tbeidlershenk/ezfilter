import tkinter as tk

class SimpleGUI:
    def __init__(self, master):
        self.master = master
        master.title("Simple GUI")

        # Create and place the search box
        self.search_var = tk.StringVar()
        self.search_entry = tk.Entry(master, textvariable=self.search_var)
        self.search_entry.pack(pady=10)

        # Create and place checkboxes
        self.checkbox_vars = []
        self.checkboxes = []
        options = ['Newsletters', 'College Emails', 'Verification Emails', 'Jobs']
        for option in options:
            var = tk.StringVar()
            checkbox = tk.Checkbutton(master, text=option, variable=var)
            checkbox.pack(anchor='w')
            self.checkbox_vars.append(var)
            self.checkboxes.append(checkbox)

        # Create and place the search button
        self.search_button = tk.Button(master, text="Search", command=self.on_search)
        self.search_button.pack(pady=10)

    def on_search(self):
        search_text = self.search_var.get()
        selected_options = [option for var, option in zip(self.checkbox_vars, self.checkboxes) if var.get() == '1']
        print(f'Searching for: {search_text}')
        print(f'Selected options: {selected_options}')

if __name__ == "__main__":
    root = tk.Tk()
    gui = SimpleGUI(root)
    root.mainloop()