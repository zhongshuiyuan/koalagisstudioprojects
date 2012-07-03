#coding=utf-8
import arcpy,json
roadFC = arcpy.GetParameterAsText(1)
stopFC = arcpy.GetParameterAsText(2)
jsonFile  = arcpy.GetParameterAsText(0)

#spatial reference checking
if cmp(arcpy.Describe(roadFC).spatialReference.name,"GCS_WGS_1984") != 0:
    raise Exception("buslines spatialreference error. not equal to 'GCS_WGS_1984'")
if cmp(arcpy.Describe(stopFC).spatialReference.name,"GCS_WGS_1984") != 0:
    raise Exception("busstops spatialreference error. not equal to 'GCS_WGS_1984'")
#fileds checking
if len(arcpy.ListFields(roadFC))!=9:
    raise Exception("buslines fields checking error")
if len(arcpy.ListFields(stopFC))!=4:
    raise Exception("busstops fields checking error")

buslines = json.loads(open(jsonFile,'r').read())
curLine = arcpy.InsertCursor(roadFC)
curStop = arcpy.InsertCursor(stopFC)
count = 0
for busline in buslines:
    lineArray = arcpy.Array()
    for point in busline["points"]:
        pnt = arcpy.Point()
        pnt.X = point["lng"]
        pnt.Y = point["lat"]
        lineArray.add(pnt)
    #buslines featureclass
    feat = curLine.newRow()
    feat.shape = lineArray
    feat.name = busline["name"]
    print busline["name"]
    feat.startTime = busline["startTime"]
    feat.endTime = busline["endTime"]
    feat.company = busline["company"]
    feat.stopsCount = busline["stopsCount"]
    curLine.insertRow(feat)
    lineArray.removeAll()       
    #busstops featureclass
    for stop in busline["stops"]:
        pnt = arcpy.Point()
        pnt.X = stop["position"]["lng"]
        pnt.Y = stop["position"]["lat"]
        feat = curStop.newRow()
        feat.shape = pnt
        feat.name = stop["name"]
        feat.lineName = busline["name"]
        curStop.insertRow(feat)
    arcpy.AddMessage("processing:"+busline["name"])
    count+=1
del curStop,curLine
arcpy.AddMessage(str(count)+" lines processed.")            

    