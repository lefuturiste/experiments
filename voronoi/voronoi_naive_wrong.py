# Diagramme de Voronoi

import matplotlib.pyplot as plt
import numpy as np

from math import hypot

from random import uniform,randint

X = []
Y = []
N = 10
for i in range(N):
	X.append(uniform(0, 1))
	Y.append(uniform(0, 1))

plt.plot(X, Y, '.')
plt.axis('scaled')
plt.xlim(0, 1)
plt.ylim(0, 1)

def rand_color():
	return (
		uniform(0, 1),
		uniform(0, 1),
		uniform(0, 1)
	)

colors = [rand_color() for k in range(N)]

print(colors)

dx = 0.005
dy = 0.005

def draw():
	for i in np.arange(0, 1, dy):
		if i%2 == 0: continue
		for j in np.arange(0, 1, dx):
			mini = None
			mini_p = None
			for k in range(N):
				dist = hypot(i-Y[k], j-X[k])
				if mini == None or dist < mini:
					mini = dist
					mini_p = k
			color = 'r'
			if mini_p != None:
				color = colors[mini_p]
			plt.fill(
				[j, j,   j+1, j+1],
				[i, i+1, i+1, i],
				color=color
			)

draw()

plt.savefig('veroinoi.png')
