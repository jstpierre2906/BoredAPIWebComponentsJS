#! /bin/bash

source ./build-config.sh

MANIFEST="MANIFEST.mf"
SOURCE_DIR="src/main/java"
RESOURCES_DIR="src/main/resources"
LIB_DIR="lib"
LIB_ALIASES_DIR="lib-aliases"
TARGET_DIR="target"
TARGET_RESOURCES_DIR="target/resources"
INFO_LEVEL="[INFO]"

clear
echo "#### Doing cleanup ##################################################"
rm -r $TARGET_DIR

echo ""
echo "#### Manifest #######################################################"
echo "$INFO_LEVEL Setting Main-Class in '$MANIFEST' file"
sed -i "s/Main-Class/Main-Class: $MAIN_CLASS/" $MANIFEST


if [ $(find . -name $LIB_DIR -type d | wc -l) -eq 1 ]; then
    echo ""
    echo "#### Copying class files from jar files #############################"
    ls -1 $LIB_ALIASES_DIR | grep -P "\.jar$" | xargs -I % cp $COMMON_LIB_DIR/% $LIB_DIR
    mkdir tmp && cd tmp
    find ../$LIB_DIR -name "*.jar" -type f -exec jar -xf {} \;
    rm -rf META-INF
    cp -r --parents ./* ../$SOURCE_DIR/
    cd -
    rm -rf tmp
    rm $LIB_DIR/*.jar
fi


echo ""
echo "#### Compile and archive ############################################"
echo "$INFO_LEVEL Entering source dir '$SOURCE_DIR'"
cd $SOURCE_DIR

echo "$INFO_LEVEL Compiling, i.e. creating .class files"
find . -name "*.java" -type f -exec javac {} \;

echo "$INFO_LEVEL Creating jar file"
jar -cvfm $JAR_NAME "../../../$MANIFEST" $(find . -name "*.class" -type f -exec echo "{} " \;)

echo "$INFO_LEVEL Cleaning up, i.e. removing .class files and empty dirs"
find . -name "*.class" -type f -exec rm {} \;
find . -type d -empty -delete

echo "$INFO_LEVEL Moving jar file at root"
mv $JAR_NAME ../../..

echo "$INFO_LEVEL Exiting source dir '$SOURCE_DIR'"
cd -


echo ""
echo "#### Files into target dir ##########################################"
echo "$INFO_LEVEL Creating '$TARGET_DIR' dir"
mkdir -p $TARGET_DIR
if [ $(find src/main -name "resources" -type d | wc -l) -eq 1 ]; then
    echo "$INFO_LEVEL Creating '$TARGET_RESOURCES_DIR' dir"
    mkdir -p $TARGET_RESOURCES_DIR;

    echo "$INFO_LEVEL Copying '$RESOURCES_DIR' into '$TARGET_DIR' dir"
    cp -r $RESOURCES_DIR/ $TARGET_DIR
fi
echo "$INFO_LEVEL Moving jar file into '$TARGET_DIR' dir"
mv $JAR_NAME $TARGET_DIR


echo ""
echo "#### Clean manifest #################################################"
echo "$INFO_LEVEL Resetting Main-Class in '$MANIFEST' file"
sed -i "s/Main-Class: $MAIN_CLASS/Main-Class/" $MANIFEST


echo ""
echo "#### Run jar file ###################################################"
echo "$INFO_LEVEL Entering '$TARGET_DIR' dir"
cd $TARGET_DIR

echo "$INFO_LEVEL Running jar file"
java -jar $JAR_NAME

echo "$INFO_LEVEL Exiting '$TARGET_DIR' dir"
cd -
