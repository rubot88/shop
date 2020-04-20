exports.get404Page = (req, res, next) => {
  res.render('404',
    {
      pageTitle: "Page Not Found",
      path: "/404"
    }
  );
}