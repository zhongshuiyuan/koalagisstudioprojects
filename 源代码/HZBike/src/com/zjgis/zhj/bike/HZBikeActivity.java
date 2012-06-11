package com.zjgis.zhj.bike;

import java.io.File;
import java.util.List;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapController;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;

import android.R.bool;
import android.R.string;
import android.app.Activity;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;

public class HZBikeActivity extends MapActivity {
    
	private MapView mMapView;
	private MapController mMapController;
	
	private BikeOverLayer mBikeLayer = null;
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        
        mMapView = (MapView) findViewById(R.id.MapView);
        
        //mMapView.
        
        mMapView.setTraffic(true);
        //mMapView.setStreetView(true);
        //mMapView.setSatellite(false);
        //mMapView.setSatellite(true);
        
        mMapController = mMapView.getController();
        mMapView.setEnabled(true);
        mMapView.setClickable(true);
        
        mMapView.setBuiltInZoomControls(true);
        
   
        GeoPoint pt = new GeoPoint((int) (30.28554 * 1000000), (int) (120.14148 * 1000000));
        
        mMapController.animateTo(pt);
        mMapController.setZoom(15);
        
        Drawable drawable = this.getResources().getDrawable(R.drawable.bike);
        this.mBikeLayer = new BikeOverLayer(drawable);
        this.mBikeLayer.InitBikeData();
        
        List<Overlay> overlays = mMapView.getOverlays();
        overlays.add(mBikeLayer);
       /*
        Drawable drawable = this.getResources().getDrawable(R.drawable.bike);
        this.mBikeLayer = new BikeOverLayer(drawable);
        
        List<Overlay> overlays = mMapView.getOverlays();
        
        
        //GeoPoint bike1 = new GeoPoint((int) (30.27986 * 1000000), (int) (120.14012 * 1000000));
        //OverlayItem bike = new OverlayItem(bike1,"","");
        //this.mBikeLayer.addOverlayItem(bike);
        
        
        
        overlays.add(mBikeLayer);
        */
        
    }

	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}
	
	
	
	
}