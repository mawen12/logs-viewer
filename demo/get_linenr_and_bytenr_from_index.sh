awk_script='
  BEGIN {
    isFirstIdx = 1;
    printed = 0;
  }

  # idx	2026-05-13-09:49	1	1
  $1 == "idx" {
    if ("'$1'" == $2) { # 找到了
      print "found " $3 " " $4;
      printed = 1;
      exit
    } else if ("'$1'" < $2) { # 索引要新
      if (isFirstIdx) {
        print "before";
      } else {
        print "found " $3 " " $4;
      }
      printed = 1;
      exit
    } else { # 
      isFirstIdx = 0;
    }
  }

  END {
    if (!printed) {
      print "after";
    }
  }
'

"$gawk_binary" -F"\t" "$awk_script" $indexfile