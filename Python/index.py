#!/usr/bin/python
# coding = utf-8

print 'Hello Python!'

str = raw_input('Please input: ')

fo = open('test.md', 'wb')
fo.seek(0, 2)
fo.write(str)
fo.close()

print 'Your inputs: ', str
