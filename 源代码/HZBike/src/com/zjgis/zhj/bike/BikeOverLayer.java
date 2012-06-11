package com.zjgis.zhj.bike;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import android.R.bool;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.drawable.Drawable;
import android.os.Environment;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.ItemizedOverlay;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;
import com.google.android.maps.Projection;

public class BikeOverLayer extends Overlay {

	private ArrayList<OverlayItem> mItems = new ArrayList<OverlayItem>();
	
	private ArrayList<OverlayItem> mAllDatas = new ArrayList<OverlayItem>();
	
	public BikeOverLayer(Drawable defaultMarder) {
		
	}
	
	public void InitBikeData(){
		String filepath = Environment.getExternalStorageDirectory().getPath()+ "/bike.s3db";
	      
        //String filepath = Environment.getExternalStorageDirectory().getPath()+ "/" + "bike.s3db";
        
    	File file = new File(filepath);

		SQLiteDatabase db = SQLiteDatabase.openOrCreateDatabase(file, null);
		
		String[] columns = new String[]{"OBJECTID","X","Y",};
		Cursor cursor = db.query("bike", columns, null, null, null, null, null);
		
		int i = 0;
		while( cursor.moveToNext() ){
				i++;
				
				if( i > 100 )
					break;
				
				String id = cursor.getString(0);
				double x = cursor.getDouble(1);
				double y = cursor.getDouble(2);
				
				//String name = cursor.getString(4);
				//byte[] byname= name.getBytes();
				//try {
				//	String name2 = new String(byname,"GBK");
				//} catch (UnsupportedEncodingException e) {
				//	// TODO Auto-generated catch block
				//	e.printStackTrace();
				//}
				//String addr = cursor.getString(5);
			
				
				
				GeoPoint bike1 = new GeoPoint((int) (y * 1000000), (int) (x * 1000000));
		        OverlayItem bike = new OverlayItem(bike1,"id",id);
		        
		        this.mAllDatas.add(bike);
		};
		
		cursor.close();
		db.close();
		
		//this.populate();
	}
	
	public void ShowData(double xmin,double ymin, double xmax, double ymax){
		//com.google.android.maps.
		this.mItems.clear();
		for (int i = 0; i < this.mAllDatas.size(); i++) {
			OverlayItem item = this.mAllDatas.get(i);
			//GeoPoint pt = item.getPoint();
			//if(!this.isPointInRect(pt, xmin, ymin, xmax, ymax))
			//	continue;
			
			this.mItems.add(item);
		}
		
		//this.populate();
	}
	
	private boolean isPointInRect(GeoPoint pt, double xmin,double ymin, double xmax, double ymax) {
		double x = pt.getLatitudeE6();
		double y = pt.getLongitudeE6();
		if( x < xmin || x > xmax )
			return false;
		
		if( y < ymin || y > ymax )
			return false;
		
		return true;
	}


	
	public void addOverlayItem(OverlayItem item){
		this.mItems.add(item);
		
	}

	@Override
	public void draw(android.graphics.Canvas canvas, com.google.android.maps.MapView mapView, boolean shadow) {
		int w = mapView.getMeasuredHeight();
		int h = mapView.getMeasuredWidth();
		GeoPoint pt = mapView.getMapCenter();
		int cx = pt.getLongitudeE6();
		int cy = pt.getLatitudeE6();
		int xmin = cx - w / 2;
		int ymin = cy - h / 2;
		int xmax = cx + w / 2;
		int ymax = cy + h / 2;
		
		this.ShowData(xmin, ymin, xmax, ymax);
		
		Projection prj = mapView.getProjection();
		Paint paint = new Paint();
		paint.setARGB(127, 255, 0, 0);
		for (int i = 0; i < this.mItems.size(); i++) {
			OverlayItem item = this.mItems.get(i);
			Point cPt = new Point();
			prj.toPixels(item.getPoint(), cPt);
			canvas.drawText("bike", cPt.x, cPt.y, paint);
		}
		
	}
}
