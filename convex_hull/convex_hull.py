import matplotlib.pyplot as plt
import math
import random
import pprint
import json
 #import jsbeautifier

def generate_points(n=100):
    X = []
    Y = []
    for i in range(n):
        X.append(random.random())
        Y.append(random.random())
    plt.plot(X, Y, '.')
    return [(X[i],Y[i]) for i in range(n)]

# def angle(p1, p2, p3):
#     p1, p2, p3 = p3, p2, p1
#     print(p1, p2, p3)
#     if p1 == p3: return math.pi
#     x1, y1 = p2[0]-p1[0], p2[1]-p1[1]
#     x2, y2 = p3[0]-p2[0], p3[1]-p2[1]
#     d = x1*y2-y1*x2
#     n1 = math.hypot(x1, y1)
#     n2 = math.hypot(x2, y2)
#     if d == 0 or n1*n2 == 0:
#         l = x1/x2
#         if l >= 0: return 0
#         return math.pi
#     dp = x1*x2 + y1*y2
#     c = math.acos(dp/(n1*n2))
#     b = (c if d > 0 else -c) % 2*math.pi
#     return math.pi*2-b

def cross_product(u, v):
    x1, y1 = u
    x2, y2 = v
    n1 = math.hypot(x1, y1)
    n2 = math.hypot(x2, y2)
    return (x1*y2-x2*y1)

# def angle(p1, p2, p3):
#     x1, y1 = p2[0]-p1[0], p2[1]-p1[1]
#     x2, y2 = p3[0]-p2[0], p3[1]-p2[1]
#     a = (math.atan2(y1, x1) - math.atan2(y2, x2))
#     if a < 0:
#         a = math.pi
#     return a


def gift_wrapping(points):
    convex_hull = []
    x_sorted = list(sorted(points, key=lambda point: point[0]))
    left_most = x_sorted[0]
    point_on_hull = left_most
    endpoint = None
    while endpoint != left_most:
        convex_hull.append(point_on_hull)
        endpoint = points[0]
        for point in points:
            cp = cross_product((
                endpoint[0] - point_on_hull[0],
                endpoint[1] - point_on_hull[1]
            ), (
                point[0] - point_on_hull[0],
                point[1] - point_on_hull[1]
            ))
            if endpoint == point_on_hull or cp < 0:
                endpoint = point
        point_on_hull = endpoint
    return convex_hull

def draw_points(points, with_edge=False):
    X, Y = [], []
    for p in points:
        X.append(p[0])
        Y.append(p[1])
    plt.plot(X, Y, '.' if not with_edge else '')

pts = generate_points(50)

#pts = [(0.1, 1), (0.2, 0.4), (0.2, 0.15), (0.4, 0.25), (0.6, 0.8), (0.55, 0.3), (0.7, 0.2), (0.5, 0.5), (0.4, 0.7), (0.3, 0.1)]
print(pts)

draw_points(pts)
hull=gift_wrapping(pts)
draw_points(hull+[hull[0]], True)
plt.show()

