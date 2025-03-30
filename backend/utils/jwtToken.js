const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    console.log("COOKIE_EXPIRE value:", process.env.COOKIE_EXPIRE); // Debugging log
    console.log("Current Date:", new Date());

    const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7; // Default to 7 if undefined

    console.log("Computed Expiry Date:", new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000));

    const options = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    res.status(statusCode).cookie('token' , token ,options).json({
        success : true,
        token,
        user
    })
}

module.exports = sendToken