#DevTinder APIs

#authRouter
POST /Signup
POST /Login
POST /logout

 #profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

 #connectionRequestRouter
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestedId
POST /request/review/rejected/:requestId

#userRouter
GET /user/connections
GET /user/requests
GET /user/feed - Gets you the profiles of other users on platform


status: ignore,interested,accepted,rejected