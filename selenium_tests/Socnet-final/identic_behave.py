from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from time import sleep
import json

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        self.driver.get("http://localhost:8080/")

        i = 0
        while(True):
            # Fill login
            self.search_login_form = self.driver.find_element_by_name("username")
            self.search_login_form.send_keys(username)
            sleep(1)

            # Fill password
            self.search_pass_form = self.driver.find_element_by_name("password")
            self.search_pass_form.send_keys(password)
            sleep(1)
            
            # Hit enter
            self.search_pass_form.send_keys(Keys.RETURN)
            try:
                if(i % 2 == 0): # 5 actions
                    sleep(1)
                    self.driver.find_element_by_id("link_like1").click()    
                    sleep(1)
                    self.driver.find_element_by_id("link_like1").click()    
                    sleep(1)
                    self.driver.execute_script("window.scrollTo(0, 400)") 
                    sleep(1)
                    self.driver.find_element_by_id("link_comments2").click()
                    sleep(1)
                    self.driver.execute_script("window.scrollTo(0, -400)")
                    sleep(1)
                    self.driver.find_element_by_id("logout").click()

                else: # 4 actions
                    sleep(1)
                    self.driver.find_element_by_id("link_like2").click()    
                    sleep(1)
                    self.driver.find_element_by_id("link_comments2").click()
                    sleep(1)
                    self.driver.find_element_by_id("logout").click()
                sleep(2)
                i += 1
                print("Prihlaseni cislo: ", i)
            except:
                print("Nepodarilo se mi najit prvek, na ktery mam kliknout.")
                sleep(5)
                self.driver.quit()
                return


# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)

page = Page(credentials['username'], credentials['password'])






