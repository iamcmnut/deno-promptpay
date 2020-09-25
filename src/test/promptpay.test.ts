import {
  assertEquals,
  assertThrows,
  assert,
} from "https://deno.land/std@0.65.0/testing/asserts.ts";

import { PromptPay } from "../main/promptpay.ts";
import { ImageType } from "../main/enum/image-type.ts";

import {
  NegativeAmountError,
  TargetMismatchError,
  NotImplementedError,
} from "../main/error/index.ts";

[
  {
    account: "0812095124",
    amount: 1000,
    expected:
      "00020101021229370016A000000677010111011300668120951245802TH5303764540410006304257F",
  },
  {
    account: "0873211829",
    amount: 1000,
    expected:
      "00020101021229370016A000000677010111011300668732118295802TH5303764540410006304C9FD",
  },
  {
    account: "0873211829",
    amount: 10.25,
    expected:
      "00020101021229370016A000000677010111011300668732118295802TH5303764540510.256304E547",
  },
  {
    account: "0873211829",
    amount: 10.251231,
    expected:
      "00020101021229370016A000000677010111011300668732118295802TH5303764540510.256304E547",
  },
  {
    account: "1111111111111",
    amount: 1000,
    expected:
      "00020101021229370016A000000677010111021311111111111115802TH5303764540410006304F6A7",
  },
  {
    account: "1-1111-11111-11-1",
    amount: 1000,
    expected:
      "00020101021229370016A000000677010111021311111111111115802TH5303764540410006304F6A7",
  },
].forEach((input) => {
  Deno.test(`promptpay.generate: target=${input.account}, amount=${input.amount}`, () => {
    const promptpay = new PromptPay(input.account, input.amount);
    const res = promptpay.generate();

    assertEquals(
      res,
      input.expected,
    );
  });
});

[
  { account: "1809900145209", amount: -100, expected: NegativeAmountError },
  { account: "08120951245", amount: 100, expected: TargetMismatchError },
].forEach((input) => {
  Deno.test(`promptpay.generate: target=${input.account}, amount=${input.amount}`, () => {
    assertThrows(() => {
      const promptpay = new PromptPay(input.account, input.amount);
      promptpay.generate();
    }, input.expected);
  });
});

Deno.test("promptpay.generateBase64Data: target=0812345678, amount=1000", () => {
  const promptpay = new PromptPay("0812345678", 1000);
  const res = promptpay.generateBase64Data();
  res.then((val) => {
    assertEquals(
      val,
      "data:image/gif;base64,R0lGODdh8wHzAYAAAAAAAP///ywAAAAA8wHzAQAC/4yPqcvtD6OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofEovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDotPgLL5jE6r1+y2+w33wOMQOmeOb8vz7D3/j+cHOEhYmGZhmKgIKFgYYbexCKmx2Cg5aHmpeYm46amZyVj3FupZynf6qdeh2prY6Rr7lxo46kYriTuZIVt71wu8axtMrKZLOtzH2nt8u1y81gz9CTs9La38IHwBjB39bH3mHV5ZQX4N7pj8/Ss7fphO/n6uTkFfPC++bhyvmm/2j1O/e62qEYwVEMAjZO0QDpz1EFrCg9scUGQWMc9CZ/8NXSWcqAjkxWwTRjrsSGjjKpT+MvqKRFCkSXj2ZrZkKUobQ5juXM6RWY+nzU0Gh+byWRFB0po9cUJ0KhGpUVTmdgZZagBrgHI6mwol2UDrCq4oxN4wewBtDa1sQ+6j5lMl2BlkyVgFonbr3R9tOVp02/XkV3Z//dKoayIv3b2B5/JlnKCvIbkF475FgwNxCcUy8nKOIdmxAs2jMUIFeFmfDdIjPsPwDJlHaMJhARcWTCl2Wt0tWItw/QK2Yby89Q5f4Hu319zHSzd/bdvuc9nFI1c/W3w2ptSgLDemvfiVCuAuhK8Uop3m7aC1l/PKfj1FchDke8fPev8w/OnKJ3P/F3haGZTxs1p0ieUX3nkS1MdCepj99xOE8y24n4IJsncgfzqYJ1oPDqq2XkoSGojBh6gVKJ58CHaWH4NjVdihUiQ6h9t7GhpnIYsplrUiaC3CWNl3BIZ4E5E5GfnUYEO2l6OP7iEHZJFMxsiAiQAiCeKUQWKp0Yg3DqielkteuKWYYVZpGpcCVnVjNxCCaYqXTVq3I3NzyvjleGma+aCQcPnZZ0lR/qmmQnJiCGWdaCpa4qCB6vckjVTiFymddy56KaU1Jpopjh4dCh6niHLjaJZkSonppJ6WmWqogJoqKquxjjkroXxS9WqXARqa65oobiqpq5Z+2iuvgra5Z6u0/waLaq1J3qqrkmc6C6uTwA4rLJ7Xaqsqtst6a6uy0zIbLrXRQvuSnaq6KBWj5D4qbpzFFvUtt7K+Wy248hZqZYS7wplvcMma6yu/M+obcLwJa0psoQB3V2y/DPab2cD4nmiwuwhjTCGyldpbb38No+tvxp0+XDDJFX8scrYtN3txyigbS/KEEh8M8pE197ixzATTfGq5MQP9s80/erzty+P2fFTEpZ5rY6fs7mo00iMrzPHMM1ctNc5IuEk1zzk/m2HXLDPs8s9be412yG3r3ATY0pLdqMa/PX2lymyanfTb8BYt9g5yqyti2Hn+C+p28+69rsVMr304eo4zXvjcuP/yaPW9j1Pu9qowb+505FdNzpR/hp/sncmjgn4s31ernfjSSQwe9eqcw70Z3k07fPvfQ3PduN1fk9667aUbT5/uwKc9NOSm8x466kPQXvfzhCuOueuaj71w87HT7X303RJBPanCF1+5dNp/zn3Wb35/ud7iM19E+fTibr71ZQfft+eyY+2z37HNf75j2tTWQryO6a96yPvAzc5HwO6xbmcQfKD0JHc2BTbQeeND3PywJz/0dc5+7QugAQO3oQRykH7wcx8JLNhADjGPhEor4OxQGEEX3s+GNZwKCz2ouvQBkGiL+yD+Jhg3HE5MeT404d0yx74e6jCEFFxg+J6wRNH/DXGFQ3kRFIWGxPcZEXxhXEIWL0jFITbRiSGAoRBhd7wZJvCAkELjFlNXxal4cX1gLCERoRdEEN4RCmfsICDzaJQ98u91V9SgHDNIx6DxUIT/o+Qkc7jGKbaRiRU8Gh/3lUYmFPKHh1TjGhX5yP7JcIRzxOHK7AhHy2nSb5mUIB5N2UnRuVGQsXTCKDuntRZeBJWshKQnF7k9KbLxCL+spCOLWUtDXs+ZNKTlLBuJSyuWUQnNvGQwx2gSYlKzlbrkpDb9KIVu2rKIgbSJOC9ZTUz+MZQ+iCTgoolMYN6yl/tLpTQluU5rLjMH9hQgPv1JymnC05ViLOVjyqlFHcEy/38HJSM69fRFb+4Tmw9FY0Fbw1Bw4vOb2cunM3FB0tFBdKLQiShFKwo1fuYuowFVaPc++kSPhrSkCa0dTNM1SJ5C858MRKg+fyVNnG7SpTv86Sdr6tOh9rSoUj0qAldKVGtltalONepJN7rNnJpUo0hNqFKTx9TeddWrZJXlQM8qz5QSB6tT1WpdubrWhaY1jlX9KhDp6aFj3lVge7VkXsdZ2GcilqVqvSZcUdrYgb5yq5E97Ft3CtiLqoim15ysWTHbT6va1LKOBa1MOfpC3dVPsKRd7FhvqtqGZlaZ86StXE8bVtpaFq+kvS1qcyvQ2gbXt8CNq2yDOtvg7rayy/9lZ3KN61zkShe3mnXob6uLyJ/ytrnWLS7Fjktd24L3uuKN7j3Xut3DEhe70yXvcMfr3dia173y5K5iW1tazl5Wv8KFbnfZG973zje++P1sgfuq16fmV8H7ZXB/vztgABsUvcxVL3wlTGAHr7e8/+Xwc3cJ0/TmdcMC7nCJPyxfE/sXxfy1LxdDfGEPtzfDr11wjRt84webs6sipnCEZRzgFc8Yw0QGMn0h3M6K9pjHMT7xkI1MY7bClr8kFvJ5mczXA+uYyk228pFTzGINd1nLoh3Dc6v84raeGTuJfayZ30xfNAuzv3Iua5mDDOc8L5WxUK5wm02b2j8nVs+E7nL/nZMMVTyzmc9OLrSj0cpoLy95sH0WnBIB/WhCq7Ozc4bs9C496EyLWtKV/QhYqSPoSI9a1JuWbKdPbelUU3bVq241nV/917lG2s207oKtTZ3rjs660b0u9o8Ny2mRuvrYBAW1qo2t51+3a9eYFiuliQ3tbBcZ2ctGdLJV7Nk7x1nb47aza6UMMW8T49Dqy3E80xw/T2NQzMouWXatwe7QnjscQLl2ua9Kb3XbO5vnyPdMHfzuOdOR127dMsIHmEmDB/rhGYR3TINdTzAT/I0TLrihMUrx/lkcqLBOIZfrDWJ0MPudU6ZHv8UN7kXneOQDv7I8Pr7ZkDNy0rzEeGBP/y7wlEdl5SB3twoVjlmGjxbH6M7bxvmNc6HuG9/T3mCpyadxm/f8hPeQOEhbfHSUJ73ae5450sHe9ai3u+nBeLlfuX1rcyfY6Ln0odetjeChN3xCvF0t0O9tUd3GRO36nvvNT2f1svt7eVu/OtEfL3BgA3zYpM6ymuW99Jp3fPFZfynM/WhrpT8Z7phn+bcB3/LEq1jaiOc8BE3f7TVD3oHOjuEAq8z6vdee4y2ltqz93feqsz33so95vSVfR8oTH/ZxjzyuG373SsM99GQnfcnvm2if+1nnrg945pEf1SMS1vfkp3zwW5/3i5/f+OxH/emf/va1f1762H//9WmO///rL5+q4rd8vCWqfLs3f/x3eVo3dYFnfbM3evVHcp7Xf/bxewNYeQcXgHWnemFWgeXHe9tnfvdHeIqmeBLIeA/IgA6XgSe4gf6nfuOHgiJYff/mfkzXeCoog/G3gPmHfjZIgd3Xgjood/8HgwBlf5uXfrF3gx8YhEHGd0godQg4gc0WgSS4fw5YgEn4Za/HhPInhS9YegQIhMUVfdjmeND3fN+HaudEf+Hmg1znfeFXhWCYhfS3hApYdCkohrGmgTN4hwlIhtpHgyZohyX4c2i4h1CYh1sYhW+4bYKof7cXhzuoh0+ohoooeH/nhtkHh3R4hYTIiHhoe6GWcz3ohFP/uH5m6IfKJYBrqIWjyIUeeHyPKImwSIqgl4qUCImI+GyhyIOBOIt/2IVUmHqBGIYT94m52ISYSIuW6IVDmIntt4Bz6Ix1GImit4xGaICG54KJiIxpOGaOqInHuILc+IPMmIxtWI3NV3zp+Ize2H5Ipo7nCH6ixI4qdYhOyHyluI6gGI1EqIqeKIxYp43hCIE6pYxWiI/nSI3E+I+fFpAN2HtJ1XnNaIq6p4/Jt5DzJopfyIIGZo4GOYaZl5Bfx4l+V48aWR6sdYDBKIHDCI30eIG6lpEC2SAoiY0pSY6+KHwrKXMX6ZK7GIn3+JH5aIzvyI+2aIgvKWw+SYJAiZPM/wZX1FeRQuiQN9SQmveQHGl23xiUCNmKuviTAFmSMsmUfIiBwCeL8wiTPJmW2TiS0hh/7niEp1iCIYl3SwmWMTmVJ0lXRQiIOqmVlTiUUmmVVBmWeTmQEImFThl2fciYIFmLJjl9O2aWOahmLSmUO1eXRgmVhTmYfyh0NwlpF2iZSriYE2malyiWZYiahllfXel8nvmYNpZMoamUmomW17iNqIh2gcmVe2mXillxrriPbIiXnRmZu9mBlFlTo7mJmBmC/ViIOEiRnPmZ1qiQXwmYxUlzTxmb1kmctQmZcymZfjmdiNmWwClywkmU38mWSFmUKvmb4Mia7AmdT5hwcv/Jkrf5nqDZmsg5meWJlWpJmsGJn2eZmK8JoHxJl9kZoNi5eqW5mugYlwjqmFVZnRJ6i/ZYjtp5drzpkeJIoRG6mXTnoTz3lvoZZVFEm+0Jnqn5isopmw66iuEpkfBnmwVpojVplPlpTBb4nzPKnzWKm/wJl73ZkSJZnCPIilGZobn5obrJmTzKidxpoRBnpUx6nfUppPvpnYs4omw3lhU6pVdaopnppFtKnzd6pBwIpm6pps4JpVmJkT/6pSzKl/H4pJ2YoLhYjMkpnxj6l3HaojX4prz4gnXKp4aKpUhKp91pnHq6nhvapl5Zn/GkpGfqppgKojEIqClaqWTqp5H/yqDTCKo/WniaGp2qCY8GOqaLuojbOZ422aV6OZSIWqh3mpOy2qlbCYzpxqnDGKa/mKNOWqS9yppUSp2lSqqu+pw7+qqqaqx9+ak+Sp6iKqjL2qpl2qyoCqmXKaB5ehCTSKPdOGKsGqrFmqbE6qj3+ae9eK3uZK6NiqOSaqfT6nI7KaPeql3xWq3oSq/2mqQQ2qQu+qDlGqix2JQFe57D+a+gJJju2p92x69a6qWxeqsAe3iT962eqmQT66xyaLHqWqUE2q6OCqtpd7ALF5ENK7LJSrJAOp/k6mMMu6m4F7JEuq4Cm6Uaip5YRrOpmrBlma8gGHQoaqYEK7QwlrJj/zevo4qx9apyGju0zelUUnquK+u0F6u1emeRU8uxB2W18rqmWduyAfuyp4q0+qq0P4uwZKm2Olq2pjqwhAqfcBujFPuijTmhM9m0hQix4nq3dku3gcutNhq3uOqPiKuwHMqQY+u3WLui8Zm0Hxu5giutliusZyink1u3hTuks/q4zLqqPTupepuUisu5hBuk0HqQecqoqPu2h4u3f2qzfdu2Ysq4bPu6ulq7UXqXpZu6gwu64lmVwHq0wnu5nYuzokt7tuuvNWukuWutO6u8yBu21Yq21iuzm5u9j9q7oZq5IGu7xkupmLu9wNu9ELugA+q4t7u3gvm96Eu0uDuoyf+7utuqutq7tMwbvqHbvsjqnl97v5Vbvfarv6abcc4Lue4bvfVLvse5sL96vtj7ubuKv8Pbv91awRe6Sn0EmwrMvMy5u5R7mqNbtP4po+wqwaRLwVxqwQQ8wCUcrSfLfSmss+mavwb8wsSrrW4LgA7coSQqmjfMsjn8wCsstbMrw62Lw8damipsuEYMi9LZtUocoRlsqU9MxGQrxQdLxfCLr0+rq5fqqzRstv97qEZ7wTucwfGrohE7xGdbwW5sxXMcxiR8xY3Yo+nJxTGbt8HLxqy7kS3MxLzaxI+qwlBsxyxcxy4MuBisnrFbxhtMk0SRq+brxYJMq+BrwktcxE7//LKK7MgT3MiH/MiBXKCM7LCUXJG2WsB4asqkzLMnXMO8+7uEPL1kPLy6jMg3u8vklK2cTL0xfL2JCrXhyctf3MDY2qdyO8yQHLQiusDKPMqqPK5ih8K23LjCzLbJfMkF/LzvurWTXM26m6nE7LHInLPZjMkhuszGDM94PLeo7MPRGs48LMTyW870y8yK2sPN+89o+sk6DMsDTcezzKkXesTde5XHLJOunMP3LMIDrdBTfM7QXM/D2sV7arkSrcbirM7UWsrHS88abM/TrMkgvdFIzM/xHNIBHckxvc/vu8juTLVeS9G+TNC3PNI0PdPzG8XI69EHmtA6vdDz3NBi/9zRJhvEw0dmT43Gcry/tTzOQq2sUI3VQ83HGW3IBq3HqpTVYQ3KVH3NXB3NNe3JfdzLYs3WUb3VJl3Iao3FwNzWdf3KTd2vTP3HeYzNZG3XFmbN5IzAca3Sv8zOL/3Xdn3QlrzGc03Ukux0rJzYYCvLjA3Dhu3XmJ3P/TzZYr3Ygp3WZl3YO8zBOt3ZHRvYkZ3Ki7uxFbvHp+3ZlQ3afD3YXi2XWQzbbP3Zql3bZ/3TM4zXY5zbvSXbvA2zbVfca53Z3svT8pzAMJ3JHwzWh73SQc3c2+zMg8jNXZ2+dO3UIPzWa9nTJgfd5izdcGqfV73Uj326432U2c3d84zby/+927vjS65Zxc5N2M+M3Kmt3JstueKt35oL375dsq/93W6N3iS53Ynr3kfd182soAssytpd4OTd4KLN3/MN4O1c1Px70SUt4J4L3JucsYCs1Qve3CRu4bhs4MfN4QnOvZKd4Xxb3vnN4vG94d494eCt4tjt4hh+4XAN4zwu3D4+m0awvjZe4+xW4WyK03Kd3N48jlZN3WM94xE+5E8u5f5N5Um83sud4g3qwZdt39KM5G+85BWt5bA7v1wOwQFs26yt5vgN2f+d5Pd8yACc5NQswMYNvfzt5zmd5icq1Rrtxzb952cO1Eid0nDsz1lOyzUO55Du5i6s5yE+6Go95qL/VelmXL+dXuYMLOiPHuOXPulbvsWjXd9fjuMRbdoUXsmzbeYT3eV0PuprbtTB7eF7++m8LrtLKuYoXb7gHOuFXpmrjs+tfesort45/uLNbt2inuyHDuUBjtZ37upgvNc0rs8CfeetnsZNVNDnHeofnd7sfduyru6I3t8cHexl/eG+2+3FXt3sK+fmDnUwqtnMPtrqi+77Te3yjub3yu+kje6VzuaH+e2uHcEF73EHX+5x7u/p/vBfLelzXuQoC+/Le/GYrteKftz1vem1PngS/80e/+O4jtCOreAVD+pvXPLL7tCAruG23snh/uhut8onPbIu+/GLrnQDD+shfEop/9/vUf7vIc/SwYrvMq7q5I70CN/uhE7vIs/QyT3zPG/ZLV3V153qNa/DQ8/u9B3i4Tr1E0/z2H7TbN/bFC/z6Vz0N27dM7/kds+0QL/yubzrVY7nnP3gaW/Rgb7nCc/0dX/HiB3pQ672Kvvze+/TQm/n2U75rnv2xK7hMe/2z+rlk//bsRzdB96++635Ld/obW/6O37lOw3kLh3DEG3zRB7trJ74D/3s6Kz6o6/jpU/wpy/5IF7voG/eop/xtO31XW/8yV/5SS3sEh74KB/6pF74VU/4Dp/vJr/6ED7Cip/Xj9/ncm/ldL/8Gh/5g+z6GC39Vn/96S++QU/SCz+9zP+X6bO/9j1P+lPu+cLf9L5v/s3P+O9/7OL/+btf++EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveQG0M5v//3f+5Zv7+EvveTG/rQf/Nce5s7/9bA/9vm/+yTd+IYv0vbP+VgP90cu/iXO8GIP/xAP9YD///WwP/b5v/sk3fiGL9L2z/lYD/dHLv4lzvBiD/8QD/WA//WwP/b5v/sk3fiGL9L2z/lYD/dHLv4lzvBiD/8QD/WA//WwP/b5v/sk3fiGL9L2z/lYD/dHLv4lzvBiD/8QD/WA//WwP/b5v/sk3fiGL9L2z/lYD/dHLv4lzvBiD/8QD/WA//WwP/b5v/sk3fiGL9L2z/lYD/dHLv4lzvBiD/8QD/WA//WwP/b5v/vW3/D6rtTI/8NKb+nn//fP//YlzvLxnrbeHuT1H++0bunaPKfd//JiD/tgv/F6v/iAP+CNTdIkL/gHr+vUv/TZP/i0S9IkL/gHr+vUv/TZP/i0/0vSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSJC/4B6/r1L/02T/4tEvSvH/vqN/7ID++Mr39Kn/u42v9eV7263/q7q3rxSv4s1fayG7s3g/4A179jS3T+u/rx/7yPa73ix/k7G/mbWzqsx7+zt/r46/v5y/i/N/YMq3/vn7sL9/jer/4Qc7+Zt7Gpj7r4e/8vT7++n7+Is7/jS3T+u/rx/7yPa73ix/k7G/mbWzqs/8e/s7f6+Ov7+cv4vzf2DKt/75+7C/f43q/+EHO/mbexqY+6+Hv/L0+/vp+/iLO/40t0/rv68f+8j2u94sf5Oxv5m1s6rMe/s7f6+Ov7+cv4vzf2DKt/76+zu7f/s5v/zoO/w978sMv+3C/+e3v/Pav4/D/sCc//LIP95vf/s5v/zoO/w978sMv+3C/+e3v/Pav4/D/sCc//LIP95vf/s5v/zoO/w978sMv+3C/+e3v/Pav4/D/sCc//LIP95vf/s5v/zoO/w978sMv+3C/+e3v/Pav4/D/sCc//LIP95vf/s5v/zoO/w978sMv+3C/+e3v/Pav4/D/sCc//LIP95v/3/7Ob/86Dv8Pe/LDL/twv/nt7/z2r+Pw/7AnP/yyD/eb3/7Ob/86Dv8Pe/LDL/v+67PxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zdfPT+LfDHbvDDP+/OP+D0z/u0bvHmWfxLz/HxD+y2D/zd/3z0/k1un3/t9k/SXD/361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MA55nOG/po97GwD7361/MJBzbB0/06K/tt4/lDc/pWpzVXH/vlt/5Iu3/qK7+38/pR3/wRI/+2n77WN7wnK7FWc319275nS/S/v+P6ur//Zx+9AdP9Oiv7beP5Q3P6Vqc1Vx/75bf+SLt/6iu/t/P6Ud/8ESP/tp++1je8JyuxVnN9fdu+Z0v0v6P6ur//Zx+9AdP9Oiv7beP5Q3P6Vqc1Vx/75bf+SLt/6iu/t/P6Ud/8ESP/tp++1je8JyuxVnN9fdu+Z0v0v6P6ur//Zx+9AdP9Oiv7beP5Q3P6VoM/G9f/3cd/dNe9pQ+7v/cwQPe2ILv3/J/+wc88pqu6btf+0l//qxP/IuP6iTt9KVO/6fc+Jh//LY/vjJ9/6vN/gwv9kSP/tNe9pQ+7v/cwQPe2ILv3/J/+wc88pqu6btf+0l//qxP/IuP6iT/7fSlTv+n3PiYf/y2P74yff+rzf4ML/ZEj/7TXvaUPu7/3MED3tiC79/yf/sHPPKarum7X/tJf/6sT/yLj+ok7fSlTv+n3PiYf/y2P74yff+rzf4ML/ZEj/7TXvaUPu7/3MFh7vxfD/+Ib+/or/wgz/GALPBG/vXwj/j2jv7KD/IcD8gCb+RfD/+Ib+/or/wgz/GALPBG/vXwj/j2jv7KD/IcD8gCb+RfD/+Ib+/or/wgz/GALPBG/vXwj/j2jv7KD/IcD8gCb+RfD/+Ib+/or/wgz/GALPBG/vXwj/j2jv7KD/IcD8gCb+RfD/+Ib+/or/wgz/GALPBG/vXwj/j2/47+yg/yHA/IAm/kXw//iG/v6K/8IM/xgCzwRv718I/49o7+yg/yHA/IAm/kXw//iG/v6K/8IM/xgCzwRj7g9A//077O4u/zes+TpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpT2+mo7/qw/7Ii7f6xzBpf89vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oY+7ON7+as//29f/9z//GFv6MM+vpe/+vP/9vXP/c8f9oYu/iVOu1N/91MP++/+6rF394Pfzcp+yjhv6VTn9/fv907v8+7v4PZ/7VH/++qxd/eD383Kfso4b+lU5/f37/dO7/Pu7+D2f+1R++qxd/eD383Kfso4b+lU5/f37/dO7/Pu7+D2f+1R++qxd/eD383Kfso4b+lU5/f37/dO7/Pu7+D2f+1R++qxd/eD383Kfso4b+lU5/f37/dO7/Pu7+D2f+1R++qxd/eD383Kfso4b+lU5/f37/dO7/Pu7+D2f+1R++qxF9ttrtTI/85ff+rnz+ilru9rO+9nvP44b+m5fvux38bqn0jArvLfH/zXbv/k7+1Bfrux3eZKjfzv/PWnfv6MXur6vrbzfsbrj/OWnuu3H/ttrP6JBOwq//3Bf+32T/7eHuS3G9ttrK7UyP/OX3/q58/opa7vazvvZ7z+OG/puX77sd/G6p9IwK7y3x/8127/5O/tQX67sd3mSo387/z1p37+jF7q+r62837G64/zlp7rtx/7baz+iQTsKv/9wX/t9k/+3h7ktxvbba7UyP/OX3/q58/opU5u5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5EZu5OYFBQAAOw==",
    );
  });
});

Deno.test("promptpay.generatePromptPayQRImage: target=0812345678, amount=1000, imageType=GIF", async (): Promise<
  void
> => {
  const promptpay = new PromptPay("0812345678", 1000);
  await promptpay.generatePromptPayQRImage(ImageType.GIF, (file, err) => {
    assert(ImageType.GIF);
    assertEquals(err == null, true);
    assert(file);
  });
});

Deno.test("promptpay.generatePromptPayQRImage: target=0812345678, amount=1000, imageType=JPG", async (): Promise<
  void
> => {
  const promptpay = new PromptPay("0812345678", 1000);
  await promptpay.generatePromptPayQRImage(ImageType.JPG, (file, err) => {
    assertEquals(err?.name, new NotImplementedError().name);
  });
});

Deno.test("promptpay.generatePromptPayQRImage: target=0812345678, amount=1000, imageType=PNG", async (): Promise<
  void
> => {
  const promptpay = new PromptPay("0812345678", 1000);
  await promptpay.generatePromptPayQRImage(ImageType.PNG, (file, err) => {
    assertEquals(err?.name, new NotImplementedError().name);
  });
});
