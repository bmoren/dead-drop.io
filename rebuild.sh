#!/bin/bash

p="./public/img";

# rebuild the uploads dir
rm -rf ${p}/uploads;
mkdir ${p}/uploads;

# copy over our index.html and the first image to serve
cp ${p}/index.html ${p}/uploads/index.html;
cp ${p}/1st.jpg ${p}/uploads/1st.jpg;