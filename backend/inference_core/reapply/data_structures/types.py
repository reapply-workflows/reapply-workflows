from enum import Enum


###########################################################################
############################### Brush Action ##############################
###########################################################################
class BrushAction(Enum):
    ADD = "Add"
    UPDATE = "Update"
    REMOVE = "Remove"


###########################################################################
############################### Interactions ##############################
###########################################################################
class InteractionType(Enum):
    ROOT = "Root"
    ADD_PLOT = "AddPlot"
    REMOVE_PLOT = "RemovePlot"
    BRUSH = "Brush"
    SELECT_PREDICTION = "SelectPrediction"
    POINT_SELECTION = "PointSelection"
    FILTER = "Filter"
    NONE = "None"


###########################################################################
################################ Algorithms ###############################
###########################################################################
class Algorithms(Enum):
    KMEANS = "KMeans"
    DBSCAN = "DBScan"
    BNL = "BNL"
    DT = "DT"
    LR = "LR"
    QR = "QR"
    QRWITHIN = "QR:within"
    DECISIONTREE = "DecisionTree"


###########################################################################
################################# Intents #################################
###########################################################################
class Intents(Enum):
    CLUSTER = "Cluster"
    OUTLIER = "Outlier"
    SKYLINE = "Skyline"
    RANGE = "Range"
    LINEARREGRESSION = "LINEARREGRESSION"
    LRWITHIN = "LR:within"
    LROUTSIDE = "LR:outside"
    QUADRATICREGRESSION = "QUADRATICREGRESSION"
    NONOUTLIER = "NonOutlier"
    SIMPLIFIEDRANGE = "SimplifiedRange"
