import mongoose from 'mongoose';
import { mailer } from 'config/mailer';
import { User } from 'models/User';
import { BadRequestErrorView } from 'util/errors';
import { PasswordResetService } from '../PasswordResetService';

jest.mock('config/mailer');

beforeAll(async () => {
  await mongoose.connect(global.mongoUri);
});

afterAll(async () => {
  mongoose.disconnect();
});

describe('Password reset service', () => {
  let passwordResetService;

  beforeEach(() => {
    passwordResetService = new PasswordResetService();
  });

  describe('triggering password reset', () => {
    const email = 'test@test.com';
    const oldHashedPassword = 'oldhashedpassword';
    let mockUser;

    beforeEach(async (done) => {
      mailer.sendMail = jest.fn(() => ({ messageId: 'some id' }));
      mockUser = new User({
        name: 'test',
        email,
        hashedPassword: oldHashedPassword,
      });
      await mockUser.save();
      done();
    });

    afterEach(async (done) => {
      await User.deleteMany({});
      done();
    });

    it('should find user with given email and return an errorsObject if it does not exist', async () => {
      const errorsObj = await passwordResetService.trigger('non.existent@email.com');

      expect(errorsObj.errors[0]).toMatchObject(
        new BadRequestErrorView(
          'The given email couldn\'t be found in our system'
        ),
      );
      expect(mailer.sendMail).not.toHaveBeenCalled();

      const user = await User.findOne({ email });
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetExpiresAt).toBeUndefined();
    });

    describe('when the user with the given email can be found', () => {
      it('should return null errorsObject', async () => {
        const errorsObj = await passwordResetService.trigger(email);

        expect(errorsObj).toBeNull();
      });

      it('should generate a password reset token, set the reset token expiry time, and reset the password to a random value', async () => {
        await passwordResetService.trigger(email);

        const user = await User.findOne({ email });
        expect(user.passwordResetToken).toEqual(expect.any(String));
        expect(user.passwordResetExpiresAt).toEqual(expect.any(Date));
        expect(user.hashedPassword).toEqual(expect.any(String));
        expect(user.hashedPassword).not.toEqual(oldHashedPassword);
      });

      it('should send a password reset email with a password reset token to the user', async () => {
        await passwordResetService.trigger(email);

        const user = await User.findOne({ email });
        expect(mailer.sendMail).toHaveBeenCalledWith({
          to: email,
          subject: 'SSN Project Portal Password Reset',
          html: passwordResetService.testExports.passwordResetEmailHtml(user),
        });
      });
    });
  });

  describe('getting password reset redirect url and success flag', () => {
    let userId;
    const passwordResetToken = 'passwordResetToken';

    beforeEach(async (done) => {
      const user = new User({
        name: 'test',
        email: 'test@test.com',
        passwordResetToken,
        passwordExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await user.save();
      userId = user.id;
      done();
    });

    afterEach(async (done) => {
      await User.deleteMany({});
      done();
    });

    describe('when the user with the given id cannot be found', () => {
      it('should return url with a message with type error that something was wrong with the reset link', async () => {
        const result = await passwordResetService.getRedirectUrlAndSuccessFlag('1'.repeat(24), passwordResetToken);

        expect(result.redirectUrl).toEqual(
          expect.stringContaining(encodeURIComponent('there was something wrong with your password reset link')),
        );
        expect(result.redirectUrl).toEqual(
          expect.stringContaining('login')
        );
        expect(result.isSuccess).toBeFalsy();
      });
    });

    describe('when the user with the given id can be found', () => {
      describe('when the user\'s password reset token does not match the one in params', () => {
        it('should return with a message with type error that something was wrong with the reset link', async () => {
          const result = await passwordResetService.getRedirectUrlAndSuccessFlag(userId, 'nonsense token');

          expect(result.redirectUrl).toEqual(
            expect.stringContaining(encodeURIComponent('there was something wrong with your password reset link')),
          );
          expect(result.redirectUrl).toEqual(
            expect.stringContaining('login')
          );
          expect(result.isSuccess).toBeFalsy();
        });
      });

      describe('when the password reset link has expired', () => {
        beforeEach(async (done) => {
          await User.findByIdAndUpdate(userId, {
            passwordResetExpiresAt: new Date(Date.now() - 60 * 60 * 1000),
          });
          done();
        });

        it('should return with a message with type error that the reset link has expired', async () => {
          const result = await passwordResetService.getRedirectUrlAndSuccessFlag(userId, passwordResetToken);

          expect(result.redirectUrl).toEqual(
            expect.stringContaining(encodeURIComponent('your password reset link has already expired')),
          );
          expect(result.redirectUrl).toEqual(
            expect.stringContaining('login')
          );
          expect(result.isSuccess).toBeFalsy();
        });
      });

      it('should return with a message with type success when user is found and reset token matches', async () => {
        const result = await passwordResetService.getRedirectUrlAndSuccessFlag(userId, passwordResetToken);

        expect(result.redirectUrl).toEqual(
          expect.stringContaining(encodeURIComponent('reset your password')),
        );
        expect(result.redirectUrl).toEqual(
          expect.stringContaining('passwordReset')
        );
        expect(result.isSuccess).toBeTruthy();
      });
    });
  });
});
