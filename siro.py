import pyautogui
import time

pyautogui.press('win')
pyautogui.write('Notepad')
pyautogui.press('enter')
time.sleep(3)

pyautogui.write("Hello")
pyautogui.hotkey('ctrl','s')
pyautogui.press('enter')