import express from 'express';
import passport from 'passport';
import { prisma } from '../../utils/prisma/index.js';
import { userController } from './user.controller.js';
import { userService } from './user.service.js';
import { userRepository } from './user.repository.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import isNotLoggin from '../../middlewares/checkLoginMiddleware.js';

let router = express.Router();

const UserRespository = new userRepository(prisma);
const UserService = new userService(UserRespository);
const UserController = new userController(UserService);

router.post('/sign-up', UserController.postSignUpcontroller);
router.post('/idCheck', UserController.idCheckController);
router.post('/login', isNotLoggin, (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info });
      } //여기로 넘어가 세션 req.session에 저장된다
      if (!user.isVerified) {
        return res.status(401).json({ message: '이메일 인증이 필요합니다' });
      }
      req.login(user, async (err) => {
        if (err) {
          return next(err);
        }

        return res.json({ message: `${user.nickname}님 환영합니다!~` });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
});

router.get('/verify', UserController.getVerifyController);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://www.nodejstrello.site/login' }), //? 그리고 passport 로그인 전략에 의해 googleStrategy로 가서 구글계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  (req, res) => {
    res.redirect('https://www.nodejstrello.site/');
  }
);

router.get('/user/get', authMiddleware, UserController.getLoginController); //authMiddleware;
router.post('/user/get', authMiddleware, UserController.getNickNameController); //authMiddleware;
router.put('/user', authMiddleware, UserController.putLoginController); //authMiddleware;
router.delete('/user', authMiddleware, UserController.deleteController); //authMiddleware;
router.delete('/logout', authMiddleware, (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    return res.json({ message: '로그아웃' });
  });
});
//authMiddleware;
export default router;
