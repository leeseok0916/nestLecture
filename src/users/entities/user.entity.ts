import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  ValidationArguments,
} from 'class-validator';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { BaseMode } from 'src/entities/base.entity';
import { PostModel } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
// @Exclude()
export class UserModel extends BaseMode {
  @Column()
  @IsString({ message: stringValidationMessage })
  // @Length(2, 20, { message: '이름은 2자 이상 20자 이하로 입력해주세요.' })
  @Length(2, 20, {
    // message(args: ValidationArguments) {
    //   return lengthValidationMessage(args);
    //   // /**
    //   //  * ValidationiAgrument 의 프롯퍼티들
    //   //  * 1. value -> 검증 되고 있는 값(입려된 값)
    //   //  * 2. constraints -> 파라미터에 입련된 제한 사항들 @Length 어노테이션의 경우에는 2,20
    //   //  *  args.constraints[0] -> 2
    //   //  *  args.constraints[1] -> 20
    //   //  * 3. targetName -> 검증되고 있는 객체의 이름 -> UserModel
    //   //  * 4. object -> 검증되고 있는 객체 -> { name: '홍길동' }
    //   //  * 5. property -> 검증되고 있는 객체의 프로퍼티 이름 -> name
    //   //  */
    //   if (args.constraints.length === 2) {
    //     return `${args.property}은(는) ${args.constraints[0]}자 이상 ${args.constraints[1]}자 이하로 입력해주세요.`;
    //   } else {
    //     return `${args.property}은(는) ${args.constraints[0]}자 이상 입력해주세요.`;
    //   }
    // },
    message: lengthValidationMessage,
  })
  name: string;

  @Column()
  // @IsString({ message: stringValidationMessage })
  // @IsEmail()
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  // @Length(8, 13, { message: '비밀번호는 8자 이상 13자 이하로 입력해주세요.' })
  @Length(8, 13, { message: lengthValidationMessage })
  /**
   * request
   * frontend -> backend  plan object(json) -> class instance(dto)
   *
   * response
   * backend -> frontend  class instance(dto) -> plan object(json)
   *
   * toClassOnly -> class instance 로 변환될때만 -> 요청을 올 때
   * toPlainOnly -> plain object 로 변환될때만 -> 응답을 보낼때
   */
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
