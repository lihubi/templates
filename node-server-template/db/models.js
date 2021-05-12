module.exports = {
	user:{
		userId:String,
		name:{ type: String, required: true },
		createTime: { type: Date, default: Date.now },
		age:Number,
	},
	case:{
		images:{ type: Array },
		address:String,
		isnew:Boolean,
		timestamp:String,
		title:String,
	},
	//课堂类型
	lessontype : {
		lessonName : String
	},
	
	reply: {
		lessonId : String,
 	    content : String,
 	    fromUserName: String,
 	    fromUserCode: String,
 	    thumbupNum: Number,
 	    child : Array,
 	    replyId : String,
 	    replyUserCode : String,
 	    replyUserName : String,
 	    time : String,
 	    deleteable : Boolean
	}
};