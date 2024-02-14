from exif import Image
import os
import webbrowser
import reverse_geocoder as rg
import pycountry
import time

image_folder = './exif-samples/jpg/gps'

def find_city(latitude, longitude):
    location_info = rg.search((latitude, longitude))[0]
    # location_info['country'] = pycountry.countries.get(alpha_2=location_info['cc'])
    print(location_info['name'])

def draw_map(latitude, longitude):
    url = f"https://www.google.com/maps?q={latitude},{longitude}"
    webbrowser.open_new_tab(url)

def convert_deg(value, direction):
    multiplier = 1
    (d, m, s) = value

    if direction == "S" or direction == "W":
        multiplier = -1

    return multiplier*(d + (m / 60.0) + (s / 3600.0))

if __name__ == '__main__':
    for filename in os.listdir(image_folder):
        with open(os.path.join(image_folder, filename), "rb") as image_file:
            image = Image(image_file)
            if image.has_exif:
                print("image:", filename)
                lat_dec = convert_deg(image.gps_latitude, image.gps_latitude_ref)
                lon_dec = convert_deg(image.gps_longitude, image.gps_longitude_ref)

                print(lat_dec, lon_dec)
                find_city(lat_dec, lon_dec)
                draw_map(lat_dec, lon_dec)

                time.sleep(2)