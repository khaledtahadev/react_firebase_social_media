const db = {
	users: [
		{
			userId: "vnsdnvlsnvklsd",
			email: "user@email.com",
			handle: "user",
			createdAt: "2019-03-15T10:59:52.798Z",
			imageUrl:
				"firebasestorage.googleapis.com/v0/b/socialproject2-59600.appspot.com/o/no-img.png?alt=media",
			// in update user details
			bio: "Hello my name is user, nice to meet you",
			websiteUrl: "http://jsjsfjdshfjsdhf",
			location: "lonodn, UK",
		},
	],
	screams: [
		{
			userHandle: "user",
			userAvatarURL: "http://imageUser",
			body: "this is the screams body",
			likeCount: 5,
			commentCount: 2,
			createdAt: new Date().toISOString(),
		},
	],
	likes: [
		{
			screamId: "glsdgl;skglsk",
			userHandle: "user",
		},
	],
	comments: [
		{
			userHandle: "user",
			screamId: "lkfwkflwkflwkfkew",
			body: "This is amizing",
			createdAt: new Date().toISOString(),
		},
	],
	notifications: [
		{
			recipient: "user",
			sender: "john",
			read: "true | false",
			screamId: "kdjsfgdksuufhgkdsufky",
			type: "like | comment",
			createdAt: "2019-03-15T10:59:52.798Z",
		},
	],
};

const userDetails = {
	// Redux data
	credentials: {
		userId: "N43KJ5H43KJHREW4J5H3JWMERHB",
		email: "user@email.com",
		handle: "user",
		createdAt: "2019-03-15T10:59:52.798Z",
		imageUrl: "image/dsfsdkfghskdfgs/dgfdhfgdh",
		bio: "Hello, my name is user, nice to meet you",
		website: "https://user.com",
		location: "Lonodn, UK",
	},
	likes: [
		{
			userHandle: "user",
			screamId: "hh7O5oWfWucVzGbHH2pa",
		},
		{
			userHandle: "user",
			screamId: "3IOnFoQexRcofs5OhBXO",
		},
	],
};
