package com.zjgis.zhj.bike;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;

public class BikeSQLiteHelper extends SQLiteOpenHelper {

	private static final int DATABASE_VERSION = 3;
	private static final String BIKE_TABLE_NAME = "bike";
	private static final String DATABASE_NAME = "file:///mnt/sdcard/hzbike.s3db";
	public BikeSQLiteHelper(Context context, String name,
			CursorFactory factory, int version) {
		super(context, name, factory, version);
		// TODO Auto-generated constructor stub
	}
	
	public BikeSQLiteHelper(Context context){
		super(context, DATABASE_NAME, null, DATABASE_VERSION);
		
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		// TODO Auto-generated method stub
		
	}
	
	public void onOpen(SQLiteDatabase db){
		super.onOpen(db);
	}

}
