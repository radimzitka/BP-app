from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from time import sleep
import json

# Prihlasi se do uctu Google, prejde na YT, nacte 5. video a diva se na nej 20 sekund
# Pak se uspi na 30s a pusti novy test - 50x dokola

class Page:
    def __init__(self, username, password):
        options = webdriver.ChromeOptions()
        options.add_argument('--window-size=1920,1080')

        options.add_argument('user-agent=random_user_agent')

        options.add_argument("--disable-infobars")
        options.add_argument("start-maximized")
        options.add_argument("--disable-extensions")

        # Pass the argument 1 to allow and 2 to block
        options.add_experimental_option("prefs", { 
            "profile.default_content_setting_values.notifications": 1 
        })

        self.driver = webdriver.Chrome('./drivers/chromedriver', options=options)
        sleep(5)
        self.driver.get("https://twitter.com/login")

        sleep(5)
        
        # Fill login
        ActionChains(self.driver).send_keys(username).perform()
        sleep(3)

        ActionChains(self.driver).send_keys(Keys.TAB).perform()

        # Fill password
        ActionChains(self.driver).send_keys(password).perform()
        sleep(3)

        # Hit enter
        ActionChains(self.driver).send_keys(Keys.ENTER).perform()

        sleep(3)
        self.driver.execute_script("window.scrollTo(0, 1000)")
        sleep(5) 
        self.driver.execute_script("window.scrollTo(0, 0)") 
        sleep(5)

        # Page source code
        # print(self.driver.page_source, "\n\n")
        try:
            self.driver.find_elements_by_tag_name("svg")[22].click()
            sleep(10)
            self.driver.execute_script("window.scrollTo(0, 1000)")
        except:
            print("Nepodarilo se najit pozadovany element")

        sleep(20)
        self.driver.quit()

        return

# Config data - login and password
with open('./configs/credentials.json') as f:
    credentials = json.load(f)

for i in range(50):
    page = Page(credentials['username'], credentials['password'])
    sleep(5)
sleep(60)






