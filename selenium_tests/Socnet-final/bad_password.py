from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep

# Po 3 neuspesnych prihlasenich zablokuje webovy prohlizec

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        sleep(1)
        self.driver.get("http://localhost:8080/")
        
        for i in range(4):
            # Fill login
            sleep(1)
            self.search_login_form = self.driver.find_element_by_name("username")
            self.search_login_form.send_keys(username)

            # Fill password
            sleep(1)
            self.search_pass_form = self.driver.find_element_by_name("password")
            self.search_pass_form.send_keys(password)

            # Hit enter
            sleep(3)
            self.search_pass_form.send_keys(Keys.RETURN)
            sleep(2)
            
        sleep(20)
        self.driver.quit()

page = Page('user','badPassword')







